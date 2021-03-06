'use strict';

var config = require('../../server/config/config'),
    sushiSeed = require('../../server/config/sushi-seed'),
    app = require('../../app'),
    jwt = require('koa-jwt'),
    baseUrl = 'http://localhost:' + config.app.port + '/api',
    supertest = require('supertest'),
    request = supertest(baseUrl);

// create a valid jwt token to be sent with every request
var token = jwt.sign({id: 2, name: 'Chuck Norris', mail: 'chuck@sushi.com'}, config.app.secret);
token = 'Bearer ' + token;

// make request and token objects available
exports.request = request;
exports.token = token;

// initiate sushi server before each test is run
// also drop and re-seed the test database before each run
console.log('Mocha starting to run server tests on port ' + config.app.port);
beforeEach(function (done) {
  this.timeout(5000); // sometimes travis ci takes too long here
  sushiSeed(true);
  app.init(done);
});

// close the server after each test is done
afterEach(function (done) {
  app.server.close(done);
});
