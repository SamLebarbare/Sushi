'use strict';

/**
 * Posts controller for serving user posts.
 */

var route = require('koa-route'),
    parse = require('co-body'),
    mongo = require('../config/mongo'),
    ws = require('../config/ws'),
    ObjectID = mongo.ObjectID;

// register koa routes
exports.init = function (app) {
  app.use(route.get('/api/buds', listBuds));
  app.use(route.get('/api/buds/:budId/view', viewBud));
  app.use(route.put('/api/buds/:budId/update', updateBud));
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
 * Saves a new post in the database after proper validations.
 */
function *createBud()
{
  // it is best to validate bud body with something like node-validator here, before saving it in the database..
  var bud  = yield parse(this);
  bud.creator = this.user;
  bud.createdTime = new Date();
  var results = yield mongo.buds.insert(bud);

  this.status = 201;
  this.body = results[0]._id.toString(); // we need .toString() here to return text/plain response

  // now notify everyone about this new post
  bud.id = bud._id;
  delete bud._id;
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
