'use strict';

/**
 * Types controller operations.
 */
var route = require('koa-route'),
    body = require('koa-better-body'),
    mongo = require('../config/mongo');

// register koa routes
exports.init = function (app) {
  app.use(body({multipart: true}));
  app.use(route.head('/api/mailboxes/incoming', incomingHead));
  app.use(route.post('/api/mailboxes/incoming', incomingPost));
};


/**
 * test
 */
 function *incomingHead() {
   console.log('head request from webhook');
   this.status = 200;
 }

function *incomingPost() {
  var incomingMail = this.request.body;
  console.log(JSON.stringify(incomingMail));

  var mail = {
    to :     incomingMail.fields['headers[To]'],
    subject: incomingMail.fields['headers[Subject]'],
    content: incomingMail.fields['html']
  };
  console.log(JSON.stringify(mail));

  var results = yield mongo.emails.insert(mail);
  console.log(JSON.stringify(results));


  this.status = 200;
}