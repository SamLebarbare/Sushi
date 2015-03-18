'use strict';

/**
 * Sushis controller.
 */

var fs    = require('fs'),
    route = require('koa-route'),
    parse = require('co-body'),
    formidable = require('koa-formidable'),
    mongo = require('../config/mongo'),
    createSushiInGraph  = require('../graph-entities/userCreateSushi'),
    createUser2SushiRel = require('../graph-entities/addUser2SushiRelation'),
    createSushi2UserRel = require('../graph-entities/addSushi2UserRelation'),
    createSushi2SushiRel  = require('../graph-entities/addSushi2SushiRelation'),
    removeUser2SushiRel = require('../graph-entities/delUser2SushiRelation'),
    getUserSushis       = require('../graph-entities/getUserSushis'),
    getRelatedChilds  = require('../graph-entities/getRelatedChildSushis'),
    getRelatedParents = require('../graph-entities/getRelatedParentSushis'),
    updateQi          = require('../graph-entities/updateQiOnSushi'),
    setType           = require('../graph-entities/setTypeOnSushi'),
    clearSushi          = require('../graph-entities/clearSushi'),
    packdata          = require('../sushi-entities/packdata'),
    xp                = require('../user-entities/xp'),
    indexer           = require('../indexer/addSushi'),
    unindexer         = require('../indexer/removeSushi'),
    search            = require('../indexer/searchSushi'),
    types             = require('../config/types'),
    emails            = require('../services/emails/index.js'),
    ws                = require('../config/ws'),
    foreach           = require('generator-foreach'),
    ObjectID          = mongo.ObjectID;

// register koa routes
exports.init = function (app) {
  app.use(route.get ('/api/sushis/search/:query', searchSushis));
  app.use(route.get ('/api/sushis', listSushis));
  app.use(route.get ('/api/sushis/:sushiId/view', viewSushi));
  app.use(route.get ('/api/sushis/:sushiId/child/:type', relatedChilds));
  app.use(route.get ('/api/sushis/:sushiId/parent/:type', relatedParent));
  app.use(route.put ('/api/sushis/:sushiId/update', updateSushi));
  app.use(route.put ('/api/sushis/:sushiId/share', shareSushi));
  app.use(route.put ('/api/sushis/:sushiId/follow', followSushi));
  app.use(route.put ('/api/sushis/:sushiId/unfollow', unfollowSushi));
  app.use(route.put ('/api/sushis/:sushiId/sponsor', sponsorSushi));
  app.use(route.put ('/api/sushis/:sushiId/unsponsor', unsponsorSushi));
  app.use(route.put ('/api/sushis/:sushiId/support', supportSushi));
  app.use(route.put ('/api/sushis/:sushiId/evolve/:type', evolveSushi));
  app.use(route.put ('/api/sushis/:sushiId/unsupport', unsupportSushi));
  app.use(route.post('/api/sushis', createSushi));
  app.use(route.post('/api/sushis/:parentSushiId', createSubSushi));
  app.use(route.post('/api/sushis/:sushiId/attachments', uploadFile));
  app.use(route.delete ('/api/sushis/:sushiId/attachments/:fileId', removeFile));
  app.use(route.post('/api/sushis/:sushiId/mailto/:to', sendSushiByMail));
  app.use(route.post('/api/sushis/:sushiId/packdata/:type', createPackData));
  app.use(route.get ('/api/sushis/:sushiId/packdata/:type', getPackData));
  app.use(route.put ('/api/sushis/:sushiId/packdata/:type', setPackData));
  app.use(route.put ('/api/sushis/:sushiId/packdata/:type/end', endPackData));
  app.use(route.delete ('/api/sushis/:sushiId', deleteSushi));
};

function *searchSushis(query)
{
  var results = yield search(query);
  this.body = results;
}

function *sendSushiByMail(sushiId, to)
{
  sushiId   = new ObjectID(sushiId);
  var sushi = yield mongo.sushis.findOne({_id : sushiId});
  yield emails.sendSushi (this.user, to, sushi);
  this.status = 200;
  this.body   = 'ok';
}

/**
* Find related labeled sushis following neo4j CHILD relationships
*/
function *relatedChilds(sushiId, type)
{
  var relatedSushisIds = yield getRelatedChilds(sushiId,type);
  var sushis = yield mongo.sushis.find(
      {_id: { $in: relatedSushisIds }}).toArray();
  var scope = this;
  yield * foreach(sushis, function * (sushi) {
        sushi.id = sushi._id;
        delete sushi._id;
        sushi.dataCache = packdata.getPack (sushi, sushi.type);
        sushi.typeInfo = types[sushi.type];
        sushi.qi = yield updateQi(scope.user, sushi, 0);
      });
  this.body = sushis;
}

/**
* Find related labeled sushis following neo4j CHILD relationships
*/
function *relatedParent(sushiId, type)
{
  var relatedSushisIds = yield getRelatedParents(sushiId,type);
  var sushis = yield mongo.sushis.find(
  {_id: { $in: relatedSushisIds }}).toArray();
  var scope = this;
  yield * foreach(sushis, function * (sushi) {
    sushi.id = sushi._id;
    delete sushi._id;
    sushi.dataCache = packdata.getPack (sushi, sushi.type);
    sushi.typeInfo = types[sushi.type];
    sushi.qi = yield updateQi(scope.user, sushi, 0);
  });
  this.body = sushis;
}

/**
 * Lists all user sushis
 */
function *listSushis()
{
  var userSushisIds = yield getUserSushis(this.user);
  var sushis = yield mongo.sushis.find(
      {_id: { $in: userSushisIds }}).toArray();

  var scope = this;
  yield * foreach(sushis, function * (sushi) {
    sushi.id = sushi._id;
    delete sushi._id;
    sushi.dataCache = packdata.getPack (sushi, sushi.type);
    sushi.typeInfo = types[sushi.type];
    sushi.qi = yield updateQi(scope.user, sushi, 0);
  });

  this.body = sushis;
}

/**
 * Get one sushi by id
 */
function *viewSushi(sushiId)
{
  sushiId   = new ObjectID(sushiId);
  var sushi = yield mongo.sushis.findOne({_id : sushiId});

  if(sushi)
  {
    sushi.id = sushi._id;
    delete sushi._id;
    sushi.dataCache = packdata.getPack (sushi, sushi.type);
    sushi.typeInfo  = types[sushi.type];
    this.body = sushi;

    sushi.qi  = yield updateQi(this.user, sushi, 0);
    var result = yield mongo.sushis.update(
        {_id: sushiId},
        {$set: {qi: sushi.qi}}
    );
  }
  else
  {
    this.throw(404, 'Sushi not found');
  }

}


/**
 * Saves a new sushi in the database after proper validations.
 */
function *createSushi()
{
  // it is best to validate sushi body with something like node-validator here, before saving it in the database..
  var sushi  = yield parse(this);
  sushi.creator = this.user;
  sushi.createdTime = new Date();
  sushi.qi = 0;

  var results = yield mongo.sushis.insert(sushi);

  sushi.id = sushi._id;
  delete sushi._id;

  //add sushi in graph
  yield createSushiInGraph (this.user, sushi);
  yield createUser2SushiRel (this.user, sushi, 'CREATED');
  sushi.qi = yield updateQi(this.user, sushi, 0);
  this.status = 201;
  this.body = results[0].id.toString(); // we need .toString() here to return text/plain response
  yield indexer(sushi);

  // now notify everyone about this new sushi
  ws.notify('qi.updated', sushi);
  ws.notify('sushis.created', sushi);
  if(sushi.type) {
    var packData = {
      type : sushi.type,
      data : {}
    };

    var result = yield mongo.sushis.update(
        {_id: sushi.id},
        {$push: {types: sushi.type, sushiPacksData: packData}}
    );

    yield setType(this.user, sushi, sushi.type);

    ws.notify('sushis.evolved', sushi);
  }

  yield xp.gainMainXP (this.user, 50);
  ws.notify('userupdate', this.user);
}

/**
 * Saves a new sushi linked to a parent sushi
 */
function *createSubSushi(parentSushiId)
{
  //get parent
  parentSushiId = new ObjectID(parentSushiId);
  var parentSushi = yield mongo.sushis.findOne({_id : parentSushiId});
  if(parentSushi === null)
  {
    this.throw(404, 'Unable to find parent sushi from id');
  }

  parentSushi.id = parentSushi._id;
  delete parentSushi._id;

  //create sushi
  var sushi  = yield parse(this);
  sushi.creator = this.user;
  sushi.createdTime = new Date();
  sushi.qi = 0;
  sushi.parentSushi = parentSushi;

  var results = yield mongo.sushis.insert(sushi);

  //embbed sub sushi in document
  yield mongo.sushis.update(
      {_id: parentSushiId},
      {$push: {subSushis: {id: sushi._id, title: sushi.title} } }
  );

  sushi.id = sushi._id;
  delete sushi._id;
  this.status = 201;
  this.body = sushi.id; // we need .toString() here to return text/plain response
  yield indexer(sushi);

  //add sushi in graph
  yield createSushiInGraph  (this.user, sushi);
  yield createUser2SushiRel (this.user, sushi, 'CREATED');
  yield createSushi2SushiRel  (sushi, parentSushi, 'PARENT');
  yield createSushi2SushiRel  (parentSushi, sushi, 'CHILD');
  //update parentqi
  parentSushi.qi = yield updateQi (this.user, parentSushi, 1);
  var result = yield mongo.sushis.update(
      {_id: parentSushi.id},
      {$set: {qi: parentSushi.qi}}
  );

  // now notify everyone about this new sushi
  ws.notify('qi.updated', sushi);
  ws.notify('qi.updated', parentSushi);
  ws.notify('sushis.created', sushi);
  ws.notify('sushis.updated', parentSushi);
  if(sushi.type) {
    var packData = {
      type : sushi.type,
      data : {}
    };

    var result = yield mongo.sushis.update(
        {_id: sushi.id},
        {$push: {types: sushi.type, sushiPacksData: packData}}
    );

    yield setType(this.user, sushi, sushi.type);

    ws.notify('sushis.evolved', sushi);

  }

  yield xp.gainMainXP (this.user, 50);
  ws.notify('userupdate', this.user);
}

/**
 * Update a sushi in the database after proper validations.
 */
function *updateSushi()
{
  var sushi  = yield parse(this);
  if(sushi.creator.id !== this.user.id)
  {
    this.throw(403, 'You are not the creator of this sushi');
  }

  sushi.lastUpdate = new Date();
  if(sushi.revision)
  {
    sushi.revision++;
  }
  else
  {
    sushi.revision = 1
  }



  sushi._id = new ObjectID(sushi.id);
  var results = yield mongo.sushis.update(
    {_id: sushi._id},
    {$set: {
      title: sushi.title,
      content: sushi.content,
      privacy: sushi.privacy,
      type: sushi.type,
      revision: sushi.revision,
      lastUpdate: sushi.lastUpdate
    }});

  if(sushi.parentSushi)
  {
    var parentSushiId = new ObjectID(sushi.parentSushi.id);
    var r=yield mongo.sushis.update(
        {_id: parentSushiId, 'subSushis.id' : sushi._id},
        {$set: {'subSushis.$.title': sushi.title } }
    );
  }

  if(sushi.subSushis)
  {
    yield * foreach(sushi.subSushis, function * (sSushi) {
      var sSushiId = new ObjectID(sSushi.id);
      var r=yield mongo.sushis.update(
          {_id: sSushiId},
          {$set: {'parentSushi.title': sushi.title } });
    });
  }

  sushi.id = sushi._id;
  delete sushi._id;

  this.status = 201;
  this.body = sushi.id.toString(); // we need .toString() here to return text/plain response
  yield indexer(sushi);

  ws.notify('sushis.updated', sushi);
}


/**
 * Add Type to sushi
 */
function *evolveSushi(sushiId, type)
{
  if(!type)
  {
    this.throw(403, 'type is not valid');
  }

  var sushiId = new ObjectID(sushiId);
  var sushi = yield mongo.sushis.findOne({_id : sushiId});
  sushi.id = sushi._id;
  delete sushi._id;

  if(sushi.creator.id !== this.user.id)
  {
    this.throw(403, 'You are not the creator of this sushi');
  }

  var evolveNeeded = true;
  if(sushi.types)
  {
    if(sushi.types.indexOf(type) !== -1)
    {
      var result = yield mongo.sushis.update(
          {_id: sushiId},
          {$set: {type: type}});
      console.log('restored in '+ type);
      evolveNeeded = false;
    }
  }

  if(evolveNeeded)
  {
    var packData = {
      type : type,
      data : {}
    };

    var result = yield mongo.sushis.update(
        {_id: sushiId},
        {$push: {types: type, sushiPacksData: packData}}
    );

    result = yield mongo.sushis.update(
        {_id: sushiId},
        {$set: {type: type}});
    console.log('evolved in '+ type);
    yield setType(this.user, sushi, type);

    yield indexer(sushi);

    if (types[type].hasOwnProperty('skills')) {
      yield xp.gainSkillXP (this.user,types[type].skills.creator, 20);
      ws.notify('userupdate', this.user);
    }


  }

  sushi.qi       = yield updateQi (this.user, sushi, 0);

  this.status = 201;
  this.body = sushi.id.toString(); // we need .toString() here to return text/plain response

  ws.notify('sushis.evolved', {id: sushiId, type: type});

}

/**
 * Share a sushi
 */
function *shareSushi(sushiId)
{
  var users   = yield parse(this);
  sushiId      = new ObjectID(sushiId);

  var result = yield mongo.sushis.update(
      {_id: sushiId},
      {$push: {shares: users}}
  );

  var sushi = yield mongo.sushis.findOne({_id : sushiId});
  sushi.id = sushi._id;
  delete sushi._id;

  yield * foreach(users, function * (user) {
    yield createSushi2UserRel(user, sushi, 'SHARED_TO');

  });

  this.status = 201;
  this.body = sushi.id.toString(); // we need .toString() here to return text/plain response

  ws.notify('qi.updated', sushi);
  ws.notify('sushis.sharesChanged', sushi);
}

/**
 * Sponsor a sushi
 */
function *sponsorSushi()
{
  var sushi   = yield parse(this);
  var sushiId = new ObjectID(sushi.id);

  if(sushi.creator.id === this.user.id)
  {
    this.throw(403, 'You are the creator of this sushi');
  }

  if(sushi.sponsors && sushi.sponsors.indexOf(this.user.id) !== -1)
  {
    this.throw(403, 'You already sponsor this sushi');
  }

  var result = yield mongo.sushis.update(
      {_id: sushiId},
      {$push: {sponsors: this.user.id}}
  );


  yield createUser2SushiRel(this.user, sushi, 'SPONSOR');
  sushi.qi = yield updateQi(this.user, sushi, 0);

  sushi = yield mongo.sushis.findOne({_id : sushiId});

  sushi.id = sushi._id;
  delete sushi._id;

  this.status = 201;
  this.body = sushi.id.toString(); // we need .toString() here to return text/plain response


  ws.notify('qi.updated', sushi);
  ws.notify('sushis.sponsorsChanged', sushi);
}

/**
 * Unsponsor a sushi
 */
function *unsponsorSushi()
{
  var sushi  = yield parse(this);
  var sushiId = new ObjectID(sushi.id);

  if(!sushi.sponsors || sushi.sponsors.indexOf(this.user.id) === -1)
  {
    this.throw(403, 'You are not sponsorer');
  }

  var result = yield mongo.sushis.update(
      {_id: sushiId},
      {$pull: {sponsors: this.user.id}}
  );


  yield removeUser2SushiRel(this.user, sushi, 'SPONSOR');
  sushi.qi = yield updateQi(this.user, sushi, 0);

  sushi = yield mongo.sushis.findOne({_id : sushiId});

  sushi.id = sushi._id;
  delete sushi._id;

  this.status = 201;
  this.body = sushi.id.toString(); // we need .toString() here to return text/plain response

  ws.notify('qi.updated', sushi);
  ws.notify('sushis.sponsorsChanged', sushi);
}

/**
 * Add Support a sushi
 */
function *supportSushi(sushiId)
{
  var sushi   = yield parse(this);
  var sushiId = new ObjectID(sushi.id);

  if(sushi.creator.id === this.user.id)
  {
    this.throw(403, 'You are the creator of this sushi');
  }

  if(sushi.supporters && sushi.supporters.indexOf(this.user.id) !== -1)
  {
    this.throw(403, 'You have already supported this sushi');
  }

  var result = yield mongo.sushis.update(
      {_id: sushiId},
      {$push: {supporters: this.user.id}}
  );


  yield createUser2SushiRel(this.user, sushi, 'SUPPORT');
  sushi.qi = yield updateQi(this.user, sushi, this.user.lvl);


  sushi = yield mongo.sushis.findOne({_id : sushiId});

  sushi.id = sushi._id;
  delete sushi._id;

  this.status = 201;
  this.body = sushi.id.toString(); // we need .toString() here to return text/plain response

  ws.notify('qi.updated', sushi);
  ws.notify('sushis.supportersChanged', sushi);
}

/**
 * Unsupport a sushi
 */
function *unsupportSushi()
{
  var sushi  = yield parse(this);
  var sushiId = new ObjectID(sushi.id);

  if(!sushi.supporters || sushi.supporters.indexOf(this.user.id) === -1)
  {
    this.throw(403, 'You are not supporter');
  }


  var result = yield mongo.sushis.update(
      {_id: sushiId},
      {$pull: {supporters: this.user.id}}
  );


  yield removeUser2SushiRel(this.user, sushi, 'SUPPORT');
  sushi.qi = yield updateQi(this.user, sushi, 0);
  ws.notify('qi.updated', sushi);

  sushi = yield mongo.sushis.findOne({_id : sushiId});

  sushi.id = sushi._id;
  delete sushi._id;

  this.status = 201;
  this.body = sushi.id.toString(); // we need .toString() here to return text/plain response


  ws.notify('sushis.supportersChanged', sushi);
}

/**
 * Follow a sushi
 */
function *followSushi()
{
  var sushi   = yield parse(this);
  var sushiId = new ObjectID(sushi.id);

  if(sushi.creator.id === this.user.id)
  {
    this.throw(403, 'You are the creator of this sushi');
  }

  if(sushi.followers && sushi.followers.indexOf(this.user.id) !== -1)
  {
    this.throw(403, 'You already follow this sushi');
  }

  var result = yield mongo.sushis.update(
      {_id: sushiId},
      {$push: {followers: this.user.id}}
  );


  yield createUser2SushiRel(this.user, sushi, 'FOLLOW');
  sushi.qi = yield updateQi(this.user, sushi, 1);
  ws.notify('qi.updated', sushi);
  sushi = yield mongo.sushis.findOne({_id : sushiId});

  sushi.id = sushi._id;
  delete sushi._id;

  this.status = 201;
  this.body = sushi.id.toString(); // we need .toString() here to return text/plain response

  ws.notify('sushis.followersChanged', sushi);
}


/**
 * Unfollow a sushi
 */
function *unfollowSushi()
{
  var sushi  = yield parse(this);
  var sushiId = new ObjectID(sushi.id);

  if(!sushi.followers || sushi.followers.indexOf(this.user.id) === -1)
  {
    this.throw(403, 'You are not follower');
  }

  var result = yield mongo.sushis.update(
      {_id: sushiId},
      {$pull: {followers: this.user.id}}
  );


  yield removeUser2SushiRel(this.user, sushi, 'FOLLOW');
  sushi.qi = yield updateQi(this.user, sushi, 0);
  ws.notify('qi.updated', sushi);
  sushi = yield mongo.sushis.findOne({_id : sushiId});

  sushi.id = sushi._id;
  delete sushi._id;

  this.status = 201;
  this.body = sushi.id.toString(); // we need .toString() here to return text/plain response


  ws.notify('sushis.followersChanged', sushi);
}

/**
 * Appends a new comment to a given sushi.
 * @param sushiId - Sushi ID.
 */
function *createComment(sushiId)
{
  sushiId         = new ObjectID(sushiId);
  var comment   = yield parse(this);
  var commentId = new ObjectID();

  // update sushi document with the new comment
  comment = {_id: commentId, from: this.user, createdTime: new Date(), message: comment.message};
  var result = yield mongo.sushis.update(
      {_id: sushiId},
      {$push: {comments: comment}}
  );



  this.status = 201;
  this.body = commentId.toString(); // we need .toString() here to return text/plain response

  var sushi = {
    id : sushiId
  };
  // now notify everyone about this new comment
  comment.id = comment._id;
  comment.sushiId = sushiId;
  delete comment._id;
  ws.notify('qi.updated', sushi);
  ws.notify('sushis.comments.created', comment);
  yield xp.gainMainXP (this.user, 2);
  ws.notify('userupdate', this.user);
}

/**
* Add files to sushi
* @param sushiId - Sushi ID.
*/
function *uploadFile(sushiId)
{
  var path = require('path');
  sushiId = new ObjectID(sushiId);
  // multipart upload
  var uploads = [];
  var form = yield formidable.parse({uploadDir: '/tmp/sushi/'},this);
  console.log (JSON.stringify(form));
  var fileData = {
    path: form.files.file.path,
    type: form.files.file.type,
    name: form.files.file.name,
    size: form.files.file.size
  };
  var result = yield mongo.sushis.update(
    {_id: sushiId},
    {$push: {files: fileData}}
  );
  var sushi = sushi = yield mongo.sushis.findOne({_id : sushiId});
  sushi.id = sushi._id;
  delete sushi._id;
  this.status = 201;
  ws.notify('sushis.updated', sushi);
}

/**
*
*/
function *getFile(sushiId, fileId)
{
  var path = require ('path');
  var os = require ('os');
  sushiId = new ObjectID(sushiId);
  var sushi = yield mongo.sushis.findOne({_id : sushiId});
  var targetFile = null;
  var targetType = null
  sushi.files.forEach (function (file) {
    if(file.name === fileId)
    {
      targetFile = file.path;
      targetType = file.type;
      return;
    }
  });
  if(targetFile !== null) {
    yield send(this, targetFile);
  }
}

/**
*
*/
function *removeFile(sushiId, fileId)
{
  sushiId = new ObjectID(sushiId);
  var sushi = yield mongo.sushis.findOne({_id : sushiId});
  var targetFile = null;
  sushi.files.forEach (function (file) {
    if(file.name === fileId)
    {
      fs.unlinkSync(file.path);
      targetFile = file;
      return;
    }
  });
  var result = yield mongo.sushis.update(
    {_id: sushiId},
    {$pull: {files: targetFile}}
  );
  var sushi = yield mongo.sushis.findOne({_id : sushiId});
  sushi.id = sushi._id;
  delete sushi._id;
  this.status = 201;
  ws.notify('sushis.updated', sushi);
}

/**
 * Create a new packData for a given typed sushi.
 * @param sushiId - Sushi ID.
 */
function *createPackData(sushiId, type)
{
  sushiId      = new ObjectID(sushiId);

  var result = yield mongo.sushis.findOne({_id : sushiId,'sushiPacksData.type' : type});
  if(result) {
    // update sushi document with the new packData
    var data = yield parse(this);
    result = yield mongo.sushis.update(
    {_id: sushiId,'sushiPacksData.type' : type},
        {$set: {'sushiPacksData.$.data': data}}
    );

    this.status = 201;
    this.body = result;
    ws.notify('sushis.sushiPacksData.updated', sushiId);
  }
  else
  {
    var packData   = {
      type: type,
      data: yield parse(this)
    };
    console.log('create packdata');
    // update sushi document with the new packData
    var result = yield mongo.sushis.update(
        {_id: sushiId},
        {$push: {sushiPacksData: packData}}
    );

    this.status = 201;
    ws.notify('sushis.sushiPacksData.created');
  }

}

/**
 * Set packData for a given typed sushi.
 * @param sushiId - Sushi ID.
 */
function *setPackData(sushiId, type)
{
  sushiId         = new ObjectID(sushiId);
  var packData   = yield parse(this);

  // update sushi document with the new packData
  var result = yield mongo.sushis.update(
      {_id: sushiId,'sushiPacksData.type' : type},
      {$set: {'sushiPacksData.$.data': packData}}
  );

  this.status = 201;
  this.body = result;
  ws.notify('sushis.sushiPacksData.updated', sushiId);
}

/**
* End packData lifecycle
* @param sushiId - Sushi ID.
*/
function *endPackData(sushiId, type)
{
  sushiId             = new ObjectID(sushiId);
  var packData      = yield parse(this);

  // update sushi document with the new packData and lockit
  var result = yield mongo.sushis.update(
  {_id: sushiId,'sushiPacksData.type' : type},
  {$set: {
    'sushiPacksData.$.data': packData,
    'sushiPacksData.$.readonly': true
    }
  });

  if (types[type].hasOwnProperty('skills')) {
    if (types[type].skills.hasOwnProperty('actor')) {
      if (packData.actor) {
        yield xp.gainSkillXP (packData.actor,types[type].skills.actor, 20);
        ws.notify('userupdate', packData.actor);
      }
    }
  }

  this.status = 201;
  this.body = result;
  ws.notify('sushis.sushiPacksData.ended', sushiId);
}

/**
* Get packData for a given typed sushi.
* @param sushiId - Sushi ID.
 */
function *getPackData(sushiId, type)
{
  sushiId        = new ObjectID(sushiId);
  var sushi      = yield mongo.sushis.findOne({_id : sushiId,'sushiPacksData.type' : type});

  var packData = packdata.getPack (sushi, type);
  this.status = 200;
  this.body = packData;
}


/**
 * Delete sushi by id
 */
function *deleteSushi(sushiId)
{
  sushiId   = new ObjectID(sushiId);
  var sushi = yield mongo.sushis.findOne({_id : sushiId});
  sushi.id = sushi._id;
  delete sushi._id;
  if(!sushi)
  {
    this.throw(403, 'Unable to find sushi');
  }
  if(sushi.creator.id !== this.user.id)
  {
    this.throw(403, 'You are not the creator of this sushi');
  }
  if(sushi.parentSushi) {
    var parentSushiId = sushi.parentSushi.id;
    yield mongo.sushis.update(
        {_id: parentSushiId},
        {$pull: {subSushis: {id: sushi.id, title: sushi.title} } }
    );
  }
  yield unindexer(sushi);
  yield clearSushi  (sushi);
  yield mongo.sushis.remove({_id : sushiId});
  this.status = 201;
  this.body = "deleted";
}
