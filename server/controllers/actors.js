'use strict';

/**
 * Users controller for user profile relation operations.
 */

var _           = require('lodash'),
    route       = require('koa-route'),
    parse       = require('co-body'),
    getTeamsIds = require('../graph-entities/getTeamsIds'),
    packdata    = require('../sushi-entities/packdata'),
    mongo       = require('../config/mongo');

// register koa routes
exports.init = function (app) {
  app.use(route.get('/api/actors/:includeMe', listActors));
};


/**
 * List actors
 */
function *listActors(includeMe) {

  var currentUID = this.user.id;

  var actors = {
    teams: []
  };
  var users  = yield mongo.users.find(
      {}).toArray();

  users.forEach(function (user)
  {
    user.id = user._id;
    delete user._id;
    //delete user.picture;
  });

  actors.users = users;

  if(!includeMe) {
    _.remove(actors.users, function(u) { return u.id === currentUID});
  }


  var teamsIds = yield getTeamsIds();
  var teamSushis = yield mongo.sushis.find(
      {_id: { $in: teamsIds }}).toArray();

  teamSushis.forEach(function (sushi){
    var packData = packdata.getPack (sushi, 'Team');
    var team = {
      id     : sushi._id,
      name   : sushi.title,
      members: packData.members
    }
    if(!includeMe) {
    _.remove(team.members, function(u) { return u.id === currentUID});
    }
    actors.teams.push(team);
  });

  this.status = 201;
  this.body   = actors;
}
