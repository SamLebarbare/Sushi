'use strict';

/**
 * Environment variables and application configuration.
 */

var path = require('path'),
    _ = require('lodash');

var baseConfig = {
  app: {
    root: path.normalize(__dirname + '/../..'),
    env: process.env.NODE_ENV,
    secret: process.env.sushi_TOKEN
  }
};

var platformConfig = {
  development: {
    app: {
      port: 3000
    },
    mongo: {
      url: 'mongodb://localhost:27017/sushi-dev'
    },
    neo4j: {
      url: 'http://localhost:7474'
    },
    es: {
      host: 'http://localhost:9200',
      log: 'trace'
    },
    mailin: {
      port: 2500,
      webhook: 'http://localhost:3000/api/mailboxes/incoming',
      disableWebhook: false,
      logFile: '/dev/null',
      logLevel: 'warn',
      smtpOptions: {},
      SMTPBanner: 'sushi Email Service'
    },
    postmark: {
      apiKey: process.env.POSTMARK_API_KEY
    },
    oauth: {
    }
  },

  test: {
    app: {
      port: 3001
    },
    mongo: {
      url: 'mongodb://localhost:27017/sushi'
    },
    es: {
      host: 'localhost:9200',
      log: 'trace',
      keepAlive: false
    },
    neo4j: {
      url: 'http://localhost:7474/'
    },
  },
  heroku: {
    app: {
      port: process.env.PORT || 3000,
      cacheTime: 7 * 24 * 60 * 60 * 1000 /* default caching time (7 days) for static files, calculated in milliseconds */
    },
    mongo: {
      url: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://localhost:27017/sushi'
    },
    neo4j: {
      url: process.env.GRAPHENEDB_URL + '/'
    },
    es: {
      host: process.env.BONSAI_URL,
      log: 'trace',
      keepAlive: false
    },
    mailin: {
      port: 25,
      webhook: 'http://sushi.loup.io/mailboxes/incoming',
      disableWebhook: false,
      logFile: '/dev/null',
      logLevel: 'info',
      smtpOptions: {},
      SMTPBanner: 'sushi Email Service'
    },
    postmark: {
      apiKey: process.env.POSTMARK_API_KEY
    },
    oauth: {
    }
  },
  production: {
    app: {
      port: 3000,
      cacheTime: 1 * 24 * 60 * 60 * 1000 /* default caching time (7 days) for static files, calculated in milliseconds */
    },
    mongo: {
      url: 'mongodb://localhost:27017/sushi-prod'
    },
    neo4j: {
      url: 'http://localhost:7474'
    },
    es: {
      host: 'http://localhost:9200',
      log: 'trace'
    },
    mailin: {
      port: 2500,
      webhook: 'http://localhost:3000/api/mailboxes/incoming',
      disableWebhook: false,
      logFile: '/dev/null',
      logLevel: 'warn',
      smtpOptions: {},
      SMTPBanner: 'sushi Email Service'
    },
    postmark: {
      apiKey: process.env.POSTMARK_API_KEY
    },
    oauth: {
    }
  }
};

// override the base configuration with the platform specific values
module.exports = _.merge(baseConfig, platformConfig[baseConfig.app.env || (baseConfig.app.env = 'development')]);
