'use strict';

/**
 * Types controller operations.
 */
var _ = require('lodash'),
    route = require('koa-route'),
    mongo = require('../config/mongo');

// register koa routes
exports.init = function (app) {
  app.use(route.get ('/api/events'  , getEvents));
};

function *getEvents() {
  var events = yield mongo.events.find({}).toArray();
  this.body = events;
  this.status = 200;
}
