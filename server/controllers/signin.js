'use strict';

/**
 * Password based signin and OAuth signin functions.
 */

var qs = require('querystring'),
    route = require('koa-route'),
    parse = require('co-body'),
    jwt = require('koa-jwt'),
    request = require('co-request'),
    config = require('../config/config'),
    createUserInGraph = require('../graph-entities/userNode'),
    mongo = require('../config/mongo');

// register sushi routes
exports.init = function (app) {
  app.use(route.post('/signin', signin));
  app.use(route.get('/signin/linkedin', linkedinsignin));
  app.use(route.get('/signin/linkedin/callback', linkedinCallback));
};

/**
 * Retrieves the user credentials and returns a JSON Web Token along with user profile info in JSON format.
 */
function *signin() {
  var credentials = yield parse(this);
  var user = yield mongo.users.findOne({email: credentials.email});

  if (!user) {
    this.throw(401, 'Incorrect e-mail address.');
  } else if (user.password !== credentials.password) {
    this.throw(401, 'Incorrect password.');
  } else {
    user.id = user._id;
    delete user._id;
    delete user.password;
    user.picture = 'api/users/' + user.id + '/picture';
  }

  // sign and send the token along with the user info
  var token = jwt.sign(user, config.app.secret, {expiresInMinutes: 90 * 24 * 60 /* 90 days */});
  this.body = {token: token, user: user};
}

/**
 * Linkedin OAuth 2.0 signin endpoint.
 */
function *linkedinsignin() {
  this.redirect(
          'https://www.linkedin.com/uas/oauth2/authorization?' +
          'client_id=' + config.oauth.linkedin.clientId +
          '&redirect_uri=' + config.oauth.linkedin.callbackUrl +
          '&response_type=code' +
          '&state=' + Math.random().toString(36).substr(2) +
          '&scope=' + config.oauth.linkedin.scope);
}

/**
 * Linkedin OAuth 2.0 callback endpoint.
 */
function *linkedinCallback() {

  if (this.query.error) {
    this.redirect('/signin');
    return;
  }

  // get an access token from linked in exchange for oauth code
  var tokenResponse = yield request.get(
          'https://www.linkedin.com/uas/oauth2/accessToken?' +
          'grant_type=authorization_code' +
          '&client_id=' + config.oauth.linkedin.clientId +
          '&redirect_uri=' + config.oauth.linkedin.callbackUrl +
          '&client_secret=' + config.oauth.linkedin.clientSecret +
          '&code=' + this.query.code);


  var token = JSON.parse(tokenResponse.body);
  console.log (token);
  if (!token.access_token) {
    this.redirect('/signin');
    return;
  }

  // get user profile (including email address) from linkedin and save user data in our database if necessary
  var profileResponse = yield request.get('https://api.linkedin.com/v1/people/~' +
  ':(email-address,first-name,last-name,industry,picture-url)'+
  '?format=json&oauth2_access_token=' + token.access_token);


  var profile = JSON.parse(profileResponse.body);
  console.log (profile);
  var user = yield mongo.users.findOne({email: profile.emailAddress});
  if (!user) {
    user = {
      _id: (yield mongo.getNextSequence('userId')),
      email: profile.emailAddress,
      name: profile.firstName + ' ' + profile.lastName,
      xp: 0,
      lvl: 1,
      skills: [],
      picture: (yield request.get(profile.pictureUrl, {encoding: 'base64'})).body
    };
    var results = yield mongo.users.insert(user);
    user.id = user._id;
    yield createUserInGraph(user);
  }

  // redirect the user to index page along with user profile object as query string
  user.id = user._id;
  delete user._id;
  user.picture = 'api/users/' + user.id + '/picture';
  var token = jwt.sign(user, config.app.secret, {expiresInMinutes: 90 * 24 * 60 /* 90 days */});
  this.redirect('/?user=' + encodeURIComponent(JSON.stringify({token: token, user: user})));
}
