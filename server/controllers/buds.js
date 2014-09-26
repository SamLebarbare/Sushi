'use strict';

/**
 * Buds controller.
 */

var route = require('koa-route'),
    parse = require('co-body'),
    mongo = require('../config/mongo'),
    createBudInGraph  = require('../graph-entities/userCreateBud'),
    createUser2BudRel = require('../graph-entities/addUser2BudRelation'),
    removeUser2BudRel = require('../graph-entities/delUser2BudRelation'),
    ws = require('../config/ws'),
    ObjectID = mongo.ObjectID;

// register koa routes
exports.init = function (app) {
  app.use(route.get('/api/buds', listBuds));
  app.use(route.get('/api/buds/:budId/view', viewBud));
  app.use(route.put('/api/buds/:budId/update', updateBud));
  app.use(route.put('/api/buds/:budId/follow', followBud));
  app.use(route.put('/api/buds/:budId/unfollow', unfollowBud));
  app.use(route.put('/api/buds/:budId/sponsor', sponsorBud));
  app.use(route.put('/api/buds/:budId/unsponsor', unsponsorBud));
  app.use(route.post('/api/buds', createBud));
  app.use(route.post('/api/buds/:budId/comments', createComment));
};

/**
 * Lists last 15 posts with latest 15 comments in them.
 */
function *listBuds()
{
  var buds = yield mongo.buds.find(
      {},
      {comments: {$slice: -15 /* only get last x many comments for each post */}},
      {limit: 15, sort: {_id: -1}} /* only get last 15 posts by last updated */).toArray();

  buds.forEach(function (bud)
  {
    bud.id = bud._id;
    delete bud._id;
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

  bud.id = bud._id;
  delete bud._id;

  this.body = bud;
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
  var results = yield mongo.buds.insert(bud);

  bud.id = bud._id;
  delete bud._id;

  //add bud in graph
  yield createBudInGraph (this.user, bud);
  this.status = 201;
  this.body = results[0].id.toString(); // we need .toString() here to return text/plain response

  // now notify everyone about this new bud
  ws.notify('buds.created', bud);
}

/**
 * Update a bud in the database after proper validations.
 */
function *updateBud()
{
  var bud  = yield parse(this);

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
  var results = yield mongo.buds.save(bud, {w: 1});

  this.status = 201;
  this.body = bud.id.toString(); // we need .toString() here to return text/plain response

  bud.id = bud._id;
  delete bud._id;

  ws.notify('buds.updated', bud);
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
  bud = yield mongo.buds.findOne({_id : budId});

  bud.id = bud._id;
  delete bud._id;

  this.status = 201;
  this.body = bud.id.toString(); // we need .toString() here to return text/plain response

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
  bud = yield mongo.buds.findOne({_id : budId});

  bud.id = bud._id;
  delete bud._id;

  this.status = 201;
  this.body = bud.id.toString(); // we need .toString() here to return text/plain response


  ws.notify('buds.sponsorsChanged', bud);
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
  bud = yield mongo.buds.findOne({_id : budId});

  bud.id = bud._id;
  delete bud._id;

  this.status = 201;
  this.body = bud.id.toString(); // we need .toString() here to return text/plain response

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
  bud = yield mongo.buds.findOne({_id : budId});

  bud.id = bud._id;
  delete bud._id;

  this.status = 201;
  this.body = bud.id.toString(); // we need .toString() here to return text/plain response


  ws.notify('buds.followersChanged', bud);
}

/**
 * Appends a new comment to a given post.
 * @param postId - Post ID.
 */
function *createComment(budId)
{
  budId         = new ObjectID(budId);
  var comment   = yield parse(this);
  var commentId = new ObjectID();

  // update post document with the new comment
  comment = {_id: commentId, from: this.user, createdTime: new Date(), message: comment.message};
  var result = yield mongo.buds.update(
      {_id: budId},
      {$push: {comments: comment}}
  );

  this.status = 201;
  this.body = commentId.toString(); // we need .toString() here to return text/plain response

  // now notify everyone about this new comment
  comment.id = comment._id;
  comment.budId = budId;
  delete comment._id;
  ws.notify('buds.comments.created', comment);
}
