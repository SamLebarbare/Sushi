'use strict';
var client        = require('./client');

module.exports = function *(query)
{

  var result = yield client.search({
    index: 'bud',
    q: query
  });

  return result;
};
