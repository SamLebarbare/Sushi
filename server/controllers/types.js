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
  var types = [{id:'Bud'},{id:'Team'}];
  //TODO: dynload budPacks
  this.status = 201;
  this.body = types;
}
