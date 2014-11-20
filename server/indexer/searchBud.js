'use strict';
var client        = require('./es-client');

module.exports = function *(query)
{

  var result = yield client.search({
    index: 'bud',
    q: query
  });

  return result;
};
