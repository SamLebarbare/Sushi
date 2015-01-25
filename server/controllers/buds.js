'use strict';

/**
 * Buds controller.
 */

var route = require('koa-route'),
    parse = require('co-body'),
    mongo = require('../config/mongo'),
    createBudInGraph  = require('../graph-entities/userCreateBud'),
    createUser2BudRel = require('../graph-entities/addUser2BudRelation'),
    createBud2UserRel = require('../graph-entities/addBud2UserRelation'),
    createBud2BudRel  = require('../graph-entities/addBud2BudRelation'),
    removeUser2BudRel = require('../graph-entities/delUser2BudRelation'),
    getUserBuds       = require('../graph-entities/getUserBuds'),
    getRelatedChilds  = require('../graph-entities/getRelatedChildBuds'),
    updateQi          = require('../graph-entities/updateQiOnBud'),
    setType           = require('../graph-entities/setTypeOnBud'),
    clearBud          = require('../graph-entities/clearBud'),
    packdata          = require('../bud-entities/packdata'),
    indexer           = require('../indexer/addBud'),
    unindexer         = require('../indexer/removeBud'),
    search           = require('../indexer/searchBud'),
    types             = require('../config/types'),
    ws = require('../config/ws'),
    foreach = require('generator-foreach'),
    ObjectID = mongo.ObjectID;

// register koa routes
exports.init = function (app) {
  app.use(route.get ('/api/buds/search/:query', searchBuds));
  app.use(route.get ('/api/buds', listBuds));
  app.use(route.get ('/api/buds/:budId/view', viewBud));
  app.use(route.get ('/api/buds/:budId/child/:type', relatedChilds));
  app.use(route.put ('/api/buds/:budId/update', updateBud));
  app.use(route.put ('/api/buds/:budId/share', shareBud));
  app.use(route.put ('/api/buds/:budId/follow', followBud));
  app.use(route.put ('/api/buds/:budId/unfollow', unfollowBud));
  app.use(route.put ('/api/buds/:budId/sponsor', sponsorBud));
  app.use(route.put ('/api/buds/:budId/unsponsor', unsponsorBud));
  app.use(route.put ('/api/buds/:budId/support/:supportValue', supportBud));
  app.use(route.put ('/api/buds/:budId/evolve/:type', evolveBud));
  app.use(route.put ('/api/buds/:budId/unsupport', unsupportBud));
  app.use(route.post('/api/buds', createBud));
  app.use(route.post('/api/buds/:parentBudId', createSubBud));
  app.use(route.post('/api/buds/:budId/comments', createComment));
  app.use(route.post('/api/buds/:budId/packdata/:type', createPackData));
  app.use(route.get ('/api/buds/:budId/packdata/:type', getPackData));
  app.use(route.put ('/api/buds/:budId/packdata/:type', setPackData));
  app.use(route.delete ('/api/buds/:budId', deleteBud));
};

function *searchBuds(query)
{
  var results = yield search(query);
  console.log(results);
  this.body = results;
}


/**
* Find related labeled buds following neo4j CHILD relationships
*/
function *relatedChilds(budId, type)
{
  var relatedBudsIds = yield getRelatedChilds(budId,type);
  console.log(relatedBudsIds);
  var buds = yield mongo.buds.find(
      {_id: { $in: relatedBudsIds }}).toArray();
  var scope = this;
  yield * foreach(buds, function * (bud) {
        bud.id = bud._id;
        delete bud._id;
        bud.dataCache = packdata.getPack (bud, bud.type);
        bud.typeInfo = types[bud.type];
        bud.qi = yield updateQi(scope.user, bud, 0);
      });
  this.body = buds;
}

/**
 * Lists all user buds
 */
function *listBuds()
{
  var userBudsIds = yield getUserBuds(this.user);
  console.log(userBudsIds);
  var buds = yield mongo.buds.find(
      {_id: { $in: userBudsIds }}).toArray();

  var scope = this;
  yield * foreach(buds, function * (bud) {
    bud.id = bud._id;
    delete bud._id;
    bud.dataCache = packdata.getPack (bud, bud.type);
    bud.typeInfo = types[bud.type];
    bud.qi = yield updateQi(scope.user, bud, 0);
    console.log(bud.qi);
  });

  this.body = buds;
}

/**
 * Get one bud by id
 */
function *viewBud(budId)
{
  budId   = new ObjectID(budId);
  var bud = yield mongo.buds.findOne({_id : budId});

  if(bud)
  {
    bud.id = bud._id;
    delete bud._id;
    bud.dataCache = packdata.getPack (bud, bud.type);
    bud.typeInfo  = types[bud.type];
    this.body = bud;

    bud.qi  = yield updateQi(this.user, bud, 0);
    var result = yield mongo.buds.update(
        {_id: budId},
        {$set: {qi: bud.qi}}
    );
  }
  else
  {
    this.throw(404, 'Bud not found');
  }

}

/**
 * Saves a new bud in the database after proper validations.
 */
function *createBud()
{
  // it is best to validate bud body with something like node-validator here, before saving it in the database..
  var bud  = yield parse(this);
  bud.creator = this.user;
  bud.createdTime = new Date();
  bud.qi = 0;
  bud.type = 'Bud';

  var results = yield mongo.buds.insert(bud);

  bud.id = bud._id;
  delete bud._id;

  //add bud in graph
  yield createBudInGraph (this.user, bud);
  yield createUser2BudRel (this.user, bud, 'CREATED');
  bud.qi = yield updateQi(this.user, bud, 0);
  this.status = 201;
  this.body = results[0].id.toString(); // we need .toString() here to return text/plain response
  yield indexer(bud);

  var budCreated = {
    actor: this.user,
    target: bud.id,
    qi: bud.qi,
    type: 'buds.created',
    when: bud.createdTime
  };

  yield mongo.events.insert(budCreated);

  // now notify everyone about this new bud
  ws.notify('qi.updated', bud);
  ws.notify('buds.created', bud);
  if(bud.type) {
    var packData = {
      type : bud.type,
      data : {}
    };

    var result = yield mongo.buds.update(
        {_id: bud.id},
        {$push: {types: bud.type, budPacksData: packData}}
    );

    yield setType(this.user, bud, bud.type);

    ws.notify('buds.evolved', bud);
  }
}

/**
 * Saves a new bud linked to a parent bud
 */
function *createSubBud(parentBudId)
{
  //get parent
  parentBudId = new ObjectID(parentBudId);
  var parentBud = yield mongo.buds.findOne({_id : parentBudId});
  if(parentBud === null)
  {
    this.throw(404, 'Unable to find parent bud from id');
  }

  parentBud.id = parentBud._id;
  delete parentBud._id;

  //create bud
  var bud  = yield parse(this);
  bud.creator = this.user;
  bud.createdTime = new Date();
  bud.qi = 0;
  bud.parentBud = parentBud;

  var results = yield mongo.buds.insert(bud);

  //embbed sub bud in document
  yield mongo.buds.update(
      {_id: parentBudId},
      {$push: {subBuds: {id: bud._id, title: bud.title} } }
  );

  bud.id = bud._id;
  delete bud._id;
  this.status = 201;
  this.body = bud.id; // we need .toString() here to return text/plain response
  yield indexer(bud);

  //add bud in graph
  yield createBudInGraph  (this.user, bud);
  yield createUser2BudRel (this.user, bud, 'CREATED');
  yield createBud2BudRel  (bud, parentBud, 'PARENT');
  yield createBud2BudRel  (parentBud, bud, 'CHILD');
  //update parentqi
  parentBud.qi = yield updateQi (this.user, parentBud, 1);
  var result = yield mongo.buds.update(
      {_id: parentBud.id},
      {$set: {qi: parentBud.qi}}
  );

  var budCreated = {
    actor: this.user,
    target: bud.id,
    qi: bud.qi,
    type: 'buds.created',
    when: bud.createdTime
  };

  yield mongo.events.insert(budCreated);

  // now notify everyone about this new bud
  ws.notify('qi.updated', bud);
  ws.notify('qi.updated', parentBud);
  ws.notify('buds.created', bud);
  ws.notify('buds.updated', parentBud);
  if(bud.type) {
    var packData = {
      type : bud.type,
      data : {}
    };

    var result = yield mongo.buds.update(
        {_id: bud.id},
        {$push: {types: bud.type, budPacksData: packData}}
    );

    yield setType(this.user, bud, bud.type);

    ws.notify('buds.evolved', bud);
  }
}

/**
 * Update a bud in the database after proper validations.
 */
function *updateBud()
{
  var bud  = yield parse(this);
  console.log(JSON.stringify(bud.budPacksData));
  if(bud.creator.id !== this.user.id)
  {
    this.throw(403, 'You are not the creator of this bud');
  }

  bud.lastUpdate = new Date();
  if(bud.revision)
  {
    bud.revision++;
  }
  else
  {
    bud.revision = 1
  }



  bud._id = new ObjectID(bud.id);
  var results = yield mongo.buds.update(
    {_id: bud._id},
    {$set: {
      title: bud.title,
      content: bud.content,
      privacy: bud.privacy,
      type: bud.type,
      revision: bud.revision,
      lastUpdate: bud.lastUpdate
    }});

  if(bud.parentBud)
  {
    var parentBudId = new ObjectID(bud.parentBud.id);
    var r=yield mongo.buds.update(
        {_id: parentBudId, 'subBuds.id' : bud._id},
        {$set: {'subBuds.$.title': bud.title } }
    );
  }

  if(bud.subBuds)
  {
    yield * foreach(bud.subBuds, function * (sBud) {
      var sBudId = new ObjectID(sBud.id);
      var r=yield mongo.buds.update(
          {_id: sBudId},
          {$set: {'parentBud.title': bud.title } });
    });
  }

  bud.id = bud._id;
  delete bud._id;

  this.status = 201;
  this.body = bud.id.toString(); // we need .toString() here to return text/plain response
  yield indexer(bud);

  var budUpdated = {
    actor: this.user,
    target: bud.id,
    type: 'buds.updated',
    when: bud.lastUpdate
  };

  yield mongo.events.insert(budUpdated);

  ws.notify('buds.updated', bud);
}


/**
 * Add Type to bud
 */
function *evolveBud(budId, type)
{
  if(!type)
  {
    this.throw(403, 'type is not valid');
  }

  var budId = new ObjectID(budId);
  var bud = yield mongo.buds.findOne({_id : budId});
  bud.id = bud._id;
  delete bud._id;

  if(bud.creator.id !== this.user.id)
  {
    this.throw(403, 'You are not the creator of this bud');
  }

  var evolveNeeded = true;
  if(bud.types)
  {
    if(bud.types.indexOf(type) !== -1)
    {
      var result = yield mongo.buds.update(
          {_id: budId},
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

    var result = yield mongo.buds.update(
        {_id: budId},
        {$push: {types: type, budPacksData: packData}}
    );

    result = yield mongo.buds.update(
        {_id: budId},
        {$set: {type: type}});
    console.log('evolved in '+ type);
    yield setType(this.user, bud, type);

    yield indexer(bud);

    var budEvolved = {
      actor: this.user,
      target: bud.id,
      qi: bud.qi,
      type: 'buds.evolved',
      when: new Date()
    };

    yield mongo.events.insert(budEvolved);
  }

  bud.qi       = yield updateQi (this.user, bud, 0);

  this.status = 201;
  this.body = bud.id.toString(); // we need .toString() here to return text/plain response

  ws.notify('buds.evolved', {id: budId, type: type});

}

/**
 * Share a bud
 */
function *shareBud(budId)
{
  var users   = yield parse(this);
  budId      = new ObjectID(budId);

  var result = yield mongo.buds.update(
      {_id: budId},
      {$push: {shares: users}}
  );

  var bud = yield mongo.buds.findOne({_id : budId});
  bud.id = bud._id;
  delete bud._id;

  yield * foreach(users, function * (user) {
    yield createBud2UserRel(user, bud, 'SHARED_TO');

  });

  this.status = 201;
  this.body = bud.id.toString(); // we need .toString() here to return text/plain response

  var budShared= {
    actor: this.user,
    target: bud.id,
    qi: bud.qi,
    type: 'buds.shared',
    when: new Date()
  };

  yield mongo.events.insert(budShared);

  ws.notify('qi.updated', bud);
}

/**
 * Sponsor a bud
 */
function *sponsorBud()
{
  var bud   = yield parse(this);
  var budId = new ObjectID(bud.id);

  if(bud.creator.id === this.user.id)
  {
    this.throw(403, 'You are the creator of this bud');
  }

  if(bud.sponsors && bud.sponsors.indexOf(this.user.id) !== -1)
  {
    this.throw(403, 'You already sponsor this bud');
  }

  var result = yield mongo.buds.update(
      {_id: budId},
      {$push: {sponsors: this.user.id}}
  );


  yield createUser2BudRel(this.user, bud, 'SPONSOR');
  bud.qi = yield updateQi(this.user, bud, 0);

  bud = yield mongo.buds.findOne({_id : budId});

  bud.id = bud._id;
  delete bud._id;

  this.status = 201;
  this.body = bud.id.toString(); // we need .toString() here to return text/plain response

  var budSponsored = {
    actor: this.user,
    target: bud.id,
    qi: bud.qi,
    type: 'buds.sponsored',
    when: new Date()
  };

  yield mongo.events.insert(budSponsored);

  ws.notify('qi.updated', bud);
  ws.notify('buds.sponsorsChanged', bud);
}

/**
 * Unsponsor a bud
 */
function *unsponsorBud()
{
  var bud  = yield parse(this);
  var budId = new ObjectID(bud.id);

  if(!bud.sponsors || bud.sponsors.indexOf(this.user.id) === -1)
  {
    this.throw(403, 'You are not sponsorer');
  }

  var result = yield mongo.buds.update(
      {_id: budId},
      {$pull: {sponsors: this.user.id}}
  );


  yield removeUser2BudRel(this.user, bud, 'SPONSOR');
  bud.qi = yield updateQi(this.user, bud, 0);

  bud = yield mongo.buds.findOne({_id : budId});

  bud.id = bud._id;
  delete bud._id;

  this.status = 201;
  this.body = bud.id.toString(); // we need .toString() here to return text/plain response

  ws.notify('qi.updated', bud);
  ws.notify('buds.sponsorsChanged', bud);
}

/**
 * Add Support a bud
 */
function *supportBud(budId, supportValue)
{
  if(supportValue > 5)
  {
    this.throw(403, 'Support value is not valid');
  }

  var bud   = yield parse(this);
  var budId = new ObjectID(bud.id);

  if(bud.creator.id === this.user.id)
  {
    this.throw(403, 'You are the creator of this bud');
  }

  if(bud.supporters && bud.supporters.indexOf(this.user.id) !== -1)
  {
    this.throw(403, 'You have already supported this bud');
  }

  var result = yield mongo.buds.update(
      {_id: budId},
      {$push: {supporters: this.user.id}}
  );


  yield createUser2BudRel(this.user, bud, 'SUPPORT');
  bud.qi = yield updateQi(this.user, bud, supportValue);


  bud = yield mongo.buds.findOne({_id : budId});

  bud.id = bud._id;
  delete bud._id;

  this.status = 201;
  this.body = bud.id.toString(); // we need .toString() here to return text/plain response

  var budSupported = {
    actor: this.user,
    target: bud.id,
    qi: bud.qi,
    type: 'buds.supported',
    when: new Date()
  };

  yield mongo.events.insert(budSupported);

  ws.notify('qi.updated', bud);
  ws.notify('buds.supportersChanged', bud);
}

/**
 * Unsupport a bud
 */
function *unsupportBud()
{
  var bud  = yield parse(this);
  var budId = new ObjectID(bud.id);

  if(!bud.supporters || bud.supporters.indexOf(this.user.id) === -1)
  {
    this.throw(403, 'You are not supporter');
  }


  var result = yield mongo.buds.update(
      {_id: budId},
      {$pull: {supporters: this.user.id}}
  );


  yield removeUser2BudRel(this.user, bud, 'SUPPORT');
  bud.qi = yield updateQi(this.user, bud, 0);
  ws.notify('qi.updated', bud);

  bud = yield mongo.buds.findOne({_id : budId});

  bud.id = bud._id;
  delete bud._id;

  this.status = 201;
  this.body = bud.id.toString(); // we need .toString() here to return text/plain response


  ws.notify('buds.supportersChanged', bud);
}

/**
 * Follow a bud
 */
function *followBud()
{
  var bud   = yield parse(this);
  var budId = new ObjectID(bud.id);

  if(bud.creator.id === this.user.id)
  {
    this.throw(403, 'You are the creator of this bud');
  }

  if(bud.followers && bud.followers.indexOf(this.user.id) !== -1)
  {
    this.throw(403, 'You already follow this bud');
  }

  var result = yield mongo.buds.update(
      {_id: budId},
      {$push: {followers: this.user.id}}
  );


  yield createUser2BudRel(this.user, bud, 'FOLLOW');
  bud.qi = yield updateQi(this.user, bud, 1);
  ws.notify('qi.updated', bud);
  bud = yield mongo.buds.findOne({_id : budId});

  bud.id = bud._id;
  delete bud._id;

  this.status = 201;
  this.body = bud.id.toString(); // we need .toString() here to return text/plain response

  var budFollowed = {
    actor: this.user,
    target: bud.id,
    qi: bud.qi,
    type: 'buds.followed',
    when: new Date()
  };

  yield mongo.events.insert(budFollowed);

  ws.notify('buds.followersChanged', bud);
}


/**
 * Unfollow a bud
 */
function *unfollowBud()
{
  var bud  = yield parse(this);
  var budId = new ObjectID(bud.id);

  if(!bud.followers || bud.followers.indexOf(this.user.id) === -1)
  {
    this.throw(403, 'You are not follower');
  }

  var result = yield mongo.buds.update(
      {_id: budId},
      {$pull: {followers: this.user.id}}
  );


  yield removeUser2BudRel(this.user, bud, 'FOLLOW');
  bud.qi = yield updateQi(this.user, bud, 0);
  ws.notify('qi.updated', bud);
  bud = yield mongo.buds.findOne({_id : budId});

  bud.id = bud._id;
  delete bud._id;

  this.status = 201;
  this.body = bud.id.toString(); // we need .toString() here to return text/plain response


  ws.notify('buds.followersChanged', bud);
}

/**
 * Appends a new comment to a given bud.
 * @param budId - Bud ID.
 */
function *createComment(budId)
{
  budId         = new ObjectID(budId);
  var comment   = yield parse(this);
  var commentId = new ObjectID();

  // update bud document with the new comment
  comment = {_id: commentId, from: this.user, createdTime: new Date(), message: comment.message};
  var result = yield mongo.buds.update(
      {_id: budId},
      {$push: {comments: comment}}
  );

  var bud = {
    id : budId
  };
  bud.qi = yield updateQi(this.user, bud, 1);


  this.status = 201;
  this.body = commentId.toString(); // we need .toString() here to return text/plain response

  var budCommented = {
    actor: this.user,
    target: bud.id,
    qi: bud.qi,
    type: 'buds.commented',
    when: new Date()
  };

  yield mongo.events.insert(budCommented);

  // now notify everyone about this new comment
  comment.id = comment._id;
  comment.budId = budId;
  delete comment._id;
  ws.notify('qi.updated', bud);
  ws.notify('buds.comments.created', comment);
}


/**
 * Create a new packData for a given typed bud.
 * @param budId - Bud ID.
 */
function *createPackData(budId, type)
{
  budId      = new ObjectID(budId);

  var result = yield mongo.buds.findOne({_id : budId,'budPacksData.type' : type});
  console.log('XXX:' + JSON.stringify(result));
  if(result) {
    // update bud document with the new packData
    var data = yield parse(this);
    result = yield mongo.buds.update(
        {_id: budId,'budPacksData.type' : type},
        {$set: {'budPacksData.$.data': data}}
    );

    this.status = 201;
    this.body = result;
    ws.notify('buds.budPacksData.updated', budId);
  }
  else
  {
    var packData   = {
      type: type,
      data: yield parse(this)
    };
    console.log('create packdata:' + JSON.stringify(packData));
    // update bud document with the new packData
    var result = yield mongo.buds.update(
        {_id: budId},
        {$push: {budPacksData: packData}}
    );

    this.status = 201;
    ws.notify('buds.budPacksData.created');
  }

}

/**
 * Set packData for a given typed bud.
 * @param budId - Bud ID.
 */
function *setPackData(budId, type)
{
  budId         = new ObjectID(budId);
  var packData   = yield parse(this);
  // update bud document with the new packData
  var result = yield mongo.buds.update(
      {_id: budId,'budPacksData.type' : type},
      {$set: {'budPacksData.$.data': packData}}
  );

  this.status = 201;
  this.body = result;
  ws.notify('buds.budPacksData.updated', budId);
}

/**
* Get packData for a given typed bud.
* @param budId - Bud ID.
 */
function *getPackData(budId, type)
{
  budId        = new ObjectID(budId);
  var bud      = yield mongo.buds.findOne({_id : budId,'budPacksData.type' : type});

  var packData = packdata.getPack (bud, type);
  console.log(packData);
  this.status = 200;
  this.body = packData;
}


/**
 * Delete bud by id
 */
function *deleteBud(budId)
{
  budId   = new ObjectID(budId);
  var bud = yield mongo.buds.findOne({_id : budId});
  bud.id = bud._id;
  delete bud._id;
  if(!bud)
  {
    this.throw(403, 'Unable to find bud');
  }
  if(bud.creator.id !== this.user.id)
  {
    this.throw(403, 'You are not the creator of this bud');
  }
  if(bud.parentBud) {
    var parentBudId = bud.parentBud.id;
    yield mongo.buds.update(
        {_id: parentBudId},
        {$pull: {subBuds: {id: bud.id, title: bud.title} } }
    );
  }
  yield unindexer(bud);
  yield clearBud  (bud);
  yield mongo.buds.remove({_id : budId});
  this.status = 201;
  this.body = "deleted";
}
