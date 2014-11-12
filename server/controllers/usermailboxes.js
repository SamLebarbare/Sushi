'use strict';

/**
 * Types controller operations.
 */
var _ = require('lodash'),
    route = require('koa-route'),
    formidable = require('koa-formidable'),
    mongo = require('../config/mongo');

// register koa routes
exports.init = function (app) {
  app.use(route.get ('/api/user/mailboxes/emails'  , getEmails));
};

function *getEmails() {
  var emails = yield mongo.emails.find(
      {to: this.user.email}).toArray();
  console.log('emails: ' + emails);
  this.body = emails;
  this.status = 200;
}
