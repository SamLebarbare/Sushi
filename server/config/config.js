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
    secret: 'mi3nind803bbfnas3' /* used in signing the jwt tokens */
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
    }
  },

  production: {
    app: {
      port: process.env.PORT || 3000,
      cacheTime: 7 * 24 * 60 * 60 * 1000 /* default caching time (7 days) for static files, calculated in milliseconds */
    },
    mongo: {
      url: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://localhost:27017/qibud'
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
