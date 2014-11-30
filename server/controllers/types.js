'use strict';

/**
 * Types controller operations.
 */

var route = require('koa-route'),
    parse = require('co-body'),
    mongo = require('../config/mongo');

// register koa routes
exports.init = function (app) {
  app.use(route.get('/api/types', listTypes));
};


/**
 * List types
 */
function *listTypes() {
  var types = [
    {
      id:'Team',
      desc:'Create team for your organisation, team can be used to share bud to team members'
    },
    {
      id:'Idea',
      desc:'Starting point for innovation, can be primed'
    },
    {
      id:'Mission',
      desc:'Define your strategy with some missions'
    }
  ];
  //TODO: dynload budPacks
  this.status = 201;
  this.body = types;
}
