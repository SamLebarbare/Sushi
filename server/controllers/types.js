'use strict';

/**
 * Types controller operations.
 */

var route = require('koa-route'),
    parse = require('co-body'),
    types = require('../config/types'),
    mongo = require('../config/mongo');

// register koa routes
exports.init = function (app) {
  app.use(route.get('/api/types', listTypes));
  app.use(route.get('/api/types/:type', getType));
};

var typeArray = [];
for (var type in types) {
  typeArray.push (types[type]);
}

/**
* Get type
*/
function *getType(type) {
  this.status = 201;
  this.body = types[type];
}

/**
 * List types
 */
function *listTypes() {
  this.status = 201;
  this.body = typeArray;
}
