'use strict';

/**
 * Entry point for sushi app. Initiates database connection and starts listening for requests on configured port.
 */

var config = require('./server/config/config'),
    mail  = require('./server/services/emails'),
    mongo = require('./server/config/mongo'),
    sushiSeed = require('./server/config/sushi-seed'),
    koaConfig = require('./server/config/koa'),
    ws = require('./server/config/ws'),
    co = require('co'),
    koa = require('koa'),
    app = koa();


module.exports = app;
app.init = co(function *() {
  // initialize mongodb and populate the database with seed data
  yield mongo.connect();
  yield sushiSeed();

  // koa config
  koaConfig(app);

  // create http and websocket servers and start listening for requests
  app.server = app.listen(config.app.port);
  ws.listen(app.server);
  if (config.app.env !== 'test') {
    console.log('sushi listening on port ' + config.app.port);
  }
  //dont use mailin in prod
  if (config.app.env !== 'production') {
    mail.init();
  }

});

// auto init if this app is not being initialized by another module (i.e. using require('./app').init();)
if (!module.parent) {
  app.init();
}
