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
    secret: process.env.QIBUD_TOKEN
  }
};

var platformConfig = {
  development: {
    app: {
      port: 3000
    },
    mongo: {
      url: 'mongodb://localhost:27017/qibud-dev'
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
      SMTPBanner: 'Qibud Email Service'
    },
    postmark: {
      apiKey: process.env.POSTMARK_API_KEY
    },
    oauth: {
      linkedin: {
        clientId: '77u90yjt9shkkx',
        clientSecret: 'cy4SSvLboSiEDg6S',
        callbackUrl: 'http://localhost:3000/signin/linkedin/callback',
        scope : 'r_basicprofile%20r_emailaddress%20r_network'
      }
    }
  },

  test: {
    app: {
      port: 3001
    },
    mongo: {
      url: 'mongodb://localhost:27017/qibud'
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
      url: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://localhost:27017/qibud'
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
      webhook: 'http://qibud.loup.io/mailboxes/incoming',
      disableWebhook: false,
      logFile: '/dev/null',
      logLevel: 'info',
      smtpOptions: {},
      SMTPBanner: 'Qibud Email Service'
    },
    postmark: {
      apiKey: process.env.POSTMARK_API_KEY
    },
    oauth: {
      linkedin: {
        clientId: '77u90yjt9shkkx',
        clientSecret: 'cy4SSvLboSiEDg6S',
        callbackUrl: 'http://qibud.loup.io/signin/linkedin/callback',
        scope : 'r_basicprofile%20r_emailaddress%20r_network'
      }
    }
  },
  production: {
    app: {
      port: 3000,
      cacheTime: 1 * 24 * 60 * 60 * 1000 /* default caching time (7 days) for static files, calculated in milliseconds */
    },
    mongo: {
      url: 'mongodb://localhost:27017/qibud-prod'
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
      SMTPBanner: 'Qibud Email Service'
    },
    postmark: {
      apiKey: process.env.POSTMARK_API_KEY
    },
    oauth: {
      linkedin: {
        clientId: '77u90yjt9shkkx',
        clientSecret: 'cy4SSvLboSiEDg6S',
        callbackUrl: 'http://qibud.loup.io/signin/linkedin/callback',
        scope : 'r_basicprofile%20r_emailaddress%20r_network'
      }
    }
  }
};

// override the base configuration with the platform specific values
module.exports = _.merge(baseConfig, platformConfig[baseConfig.app.env || (baseConfig.app.env = 'development')]);
