'use strict';

/**
 * Remote debugging tools controller for the API. Remove this controller in production if you don't want random people dropping your database!
 */

var route = require('koa-route'),
    config = require('../config/config'),
    sushiSeed = require('../config/sushi-seed');

// register koa routes
exports.init = function (app) {
  app.use(route.post('/api/debug/clearDatabase', clearDatabase));
};

function *clearDatabase() {
  // todo: check user role === 'admin' when role system is ready
  yield sushiSeed(true);
  this.status = 200;
}
