'use strict';

/**
 * Sushi linking controller.
 */

var route = require('koa-route'),
    parse = require('co-body'),
    mongo = require('../config/mongo'),
    createUser2SushiRel = require('../graph-entities/addUser2SushiRelation'),
    createSushi2UserRel = require('../graph-entities/addSushi2UserRelation'),
    createSushi2SushiRel  = require('../graph-entities/addSushi2SushiRelation'),
    removeUser2SushiRel = require('../graph-entities/delUser2SushiRelation'),
    findUser2SushiIds   = require('../graph-entities/findUser2SushiIds'),
    packdata          = require('../sushi-entities/packdata'),
    types             = require('../config/types'),
    ws = require('../config/ws'),
    foreach = require('generator-foreach'),
    ObjectID = mongo.ObjectID;

// register koa routes
exports.init = function (app) {
  app.use(route.post  ('/api/links/b2b/:sushiId/:type/:sushiId2', createB2B));
  app.use(route.post  ('/api/links/b2u/:sushiId/:type/:userId', createB2U));
  app.use(route.post  ('/api/links/u2b/:userId/:type/:sushiId', createU2B));
  app.use(route.delete('/api/links/u2b/:userId/:type/:sushiId', deleteU2B));
  app.use(route.get   ('/api/links/u2b/:userId/:type', findU2B));
};


/**
* findU2B sushis
*/
function *findU2B(userId, type)
{
  var sushiIds = yield findUser2SushiIds (userId, type);
  var sushis   = yield mongo.sushis.find(
                  {_id: { $in: sushiIds }}).toArray();
  var scope = this;
  yield * foreach(sushis, function * (sushi) {
    sushi.id = sushi._id;
    delete sushi._id;
    sushi.dataCache = packdata.getPack (sushi, sushi.type);
    sushi.typeInfo = types[sushi.type];
  });
  this.status = 200;
  this.body   = sushis;
}

/**
 * Create Sushi2Sushi relation
 */
function *createB2B(sushiId, type, sushiId2)
{
  //get first sushi
  sushiId = new ObjectID(sushiId);
  var sushi = yield mongo.sushis.findOne({_id : sushiId});
  if(sushi === null)
  {
    this.throw(404, 'Unable to find first sushi');
  }
  sushi.id = sushi._id;
  delete sushi._id;

  sushiId2 = new ObjectID(sushiId2);
  var sushi2 = yield mongo.sushis.findOne({_id : sushiId2});
  if(sushi2 === null)
  {
    this.throw(404, 'Unable to find second sushi');
  }
  sushi2.id = sushi2._id;
  delete sushi2._id;

  this.status = 201;
  this.body = yield createSushi2SushiRel  (sushi, sushi2, type);

}

/**
 * Create Sushi2User relation
 */
function *createB2U(sushiId, type, userId)
{
  //get first sushi
  sushiId = new ObjectID(sushiId);
  var sushi = yield mongo.sushis.findOne({_id : sushiId});
  if(sushi === null)
  {
    this.throw(404, 'Unable to find first sushi');
  }

  userId = parseInt(userId);
  var user = yield mongo.users.findOne({_id : userId});
  if(user === null)
  {
    this.throw(404, 'Unable to find user');
  }
  user.id = user._id;
  delete user._id;

  this.status = 201;
  this.body = yield createSushi2UserRel  (sushi, user, type);
}

/**
 * Create User2Sushi relation
 */
function *createU2B(userId, type, sushiId)
{

  //get first sushi
  sushiId   = new ObjectID(sushiId);
  var sushi = yield mongo.sushis.findOne({_id : sushiId});
  if(sushi === null)
  {
    this.throw(404, 'Unable to find first sushi');
  }
  sushi.id = sushi._id;
  delete sushi._id;

  userId = parseInt(userId);
  var user = yield mongo.users.findOne({_id : userId});
  if(user === null)
  {
    this.throw(404, 'Unable to find user');
  }
  user.id = user._id;
  delete user._id;

  this.status = 201;
  this.body = yield createUser2SushiRel  (user, sushi, type);
}

/**
 * Delete User2Sushi relation
 */
function *deleteU2B(userId, type, sushiId)
{
  //get first sushi
  sushiId = new ObjectID(sushiId);
  var sushi = yield mongo.sushis.findOne({_id : sushiId});
  if(sushi === null)
  {
    this.throw(404, 'Unable to find first sushi');
  }
  sushi.id = sushi._id;
  delete sushi._id;

  userId = parseInt(userId);
  var user = yield mongo.users.findOne({_id : userId});
  if(user === null)
  {
    this.throw(404, 'Unable to find user');
  }
  user.id = user._id;
  delete user._id;

  this.status = 201;
  this.body = yield removeUser2SushiRel  (user, sushi, type);
}
