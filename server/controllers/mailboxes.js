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
  app.use(route.head('/api/mailboxes/incoming', incomingHead));
  app.use(route.post('/api/mailboxes/incoming', incomingPost));
  app.use(route.get ('/api/mailboxes/emails'  , getEmails));
};


/**
 * test
 */
 function *incomingHead() {
   console.log('head request from webhook');
   this.status = 200;
 }

function *incomingPost() {
  var incomingMail = yield formidable.parse(this);
  console.log(JSON.stringify(incomingMail));
  var toEmails = incomingMail.fields['headers[To]'].split(',');
  var to = [];
  _(toEmails).forEach(function(email) {
    var part   = email.split('<')[1];
    var toPart = part.split('>')[0];
    to.push(toPart);
  });

  var mail = {
    to :     to,
    subject: incomingMail.fields['headers[Subject]'],
    content: incomingMail.fields['html']
  };
  console.log(JSON.stringify(mail));

  var results = yield mongo.emails.insert(mail);
  console.log(JSON.stringify(results));


  this.status = 200;
}

//Extract from here!!! security issue
function *getEmails(user) {
  var emails = yield mongo.emails.find(
      {}).toArray();
  this.body = emails;
  this.status = 200;
}
