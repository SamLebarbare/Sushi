'use strict';

/**
 * Users controller for user profile relation operations.
 */

var route       = require('koa-route'),
    parse       = require('co-body'),
    getTeamsIds = require('../graph-entities/getTeamsIds'),
    packdata    = require('../bud-entities/packdata'),
    mongo       = require('../config/mongo');

// register koa routes
exports.init = function (app) {
  app.use(route.get('/api/actors', listActors));
};


/**
 * List actors
 */
function *listActors() {
  var actors = {
    teams: []
  };
  var users  = yield mongo.users.find(
      {}).toArray();

  users.forEach(function (user)
  {
    user.id = user._id;
    delete user._id;
    delete user.picture;
  });

  actors.users = users;

  var teamsIds = yield getTeamsIds();
  var teamBuds = yield mongo.buds.find(
      {_id: { $in: teamsIds }}).toArray();

  teamBuds.forEach(function (bud){
    var packData = packdata.getPack (bud, 'Team');
    var team = {
      id     : bud._id,
      name   : bud.title,
      members: packData.members
    }

  });

  actors.teams = teams;

  this.status = 201;
  this.body = users;
}
