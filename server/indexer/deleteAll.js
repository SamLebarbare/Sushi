'use strict';
var client        = require('./es-client');

module.exports = function *()
{

  yield client.indices.delete({
    index: 'bud'
  });

};
