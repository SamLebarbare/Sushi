'use strict';

/**
 * Bud linking controller.
 */

var route = require('koa-route'),
    parse = require('co-body'),
    mongo = require('../config/mongo'),
    createUser2BudRel = require('../graph-entities/addUser2BudRelation'),
    createBud2UserRel = require('../graph-entities/addBud2UserRelation'),
    createBud2BudRel  = require('../graph-entities/addBud2BudRelation'),
    removeUser2BudRel = require('../graph-entities/delUser2BudRelation'),
    findUser2BudIds   = require('../graph-entities/findUser2BudIds'),
    ws = require('../config/ws'),
    ObjectID = mongo.ObjectID;

// register koa routes
exports.init = function (app) {
  app.use(route.post  ('/api/links/b2b/:budId/:type/:budId2', createB2B));
  app.use(route.post  ('/api/links/b2u/:budId/:type/:userId', createB2U));
  app.use(route.post  ('/api/links/u2b/:userId/:type/:budId', createU2B));
  app.use(route.delete('/api/links/u2b/:userId/:type/:budId', deleteU2B));
  app.use(route.get   ('/api/links/u2b/:userId/:type', findU2B));
};


/**
* findU2B buds
*/
function *findU2B(userId, type)
{
  var budIds = yield findUser2BudIds (userId, type);
  var buds   = yield mongo.buds.find(
                  {_id: { $in: budIds }}).toArray();
  this.status = 200;
  this.body   = buds;
}

/**
 * Create Bud2Bud relation
 */
function *createB2B(budId, type, budId2)
{
  //get first bud
  budId = new ObjectID(budId);
  var bud = yield mongo.buds.findOne({_id : budId});
  if(bud === null)
  {
    this.throw(404, 'Unable to find first bud');
  }
  bud.id = bud._id;
  delete bud._id;

  budId2 = new ObjectID(budId2);
  var bud2 = yield mongo.buds.findOne({_id : budId2});
  if(bud2 === null)
  {
    this.throw(404, 'Unable to find second bud');
  }
  bud2.id = bud2._id;
  delete bud2._id;

  this.status = 201;
  this.body = yield createBud2BudRel  (bud, bud2, type);

}

/**
 * Create Bud2User relation
 */
function *createB2U(budId, type, userId)
{
  //get first bud
  budId = new ObjectID(budId);
  var bud = yield mongo.buds.findOne({_id : budId});
  if(bud === null)
  {
    this.throw(404, 'Unable to find first bud');
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
  this.body = yield createBud2UserRel  (bud, user, type);
}

/**
 * Create User2Bud relation
 */
function *createU2B(userId, type, budId)
{

  //get first bud
  budId   = new ObjectID(budId);
  var bud = yield mongo.buds.findOne({_id : budId});
  if(bud === null)
  {
    this.throw(404, 'Unable to find first bud');
  }
  bud.id = bud._id;
  delete bud._id;

  userId = parseInt(userId);
  var user = yield mongo.users.findOne({_id : userId});
  if(user === null)
  {
    this.throw(404, 'Unable to find user');
  }
  user.id = user._id;
  delete user._id;

  this.status = 201;
  this.body = yield createUser2BudRel  (user, bud, type);
}

/**
 * Delete User2Bud relation
 */
function *deleteU2B(userId, type, budId)
{
  //get first bud
  budId = new ObjectID(budId);
  var bud = yield mongo.buds.findOne({_id : budId});
  if(bud === null)
  {
    this.throw(404, 'Unable to find first bud');
  }
  bud.id = bud._id;
  delete bud._id;

  userId = parseInt(userId);
  var user = yield mongo.users.findOne({_id : userId});
  if(user === null)
  {
    this.throw(404, 'Unable to find user');
  }
  user.id = user._id;
  delete user._id;

  this.status = 201;
  this.body = yield removeUser2BudRel  (user, bud, type);
}
