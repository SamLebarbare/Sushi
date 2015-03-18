'use strict';
var client        = require('./es-client');

module.exports = function *(sushi)
{

  yield client.deleteByQuery({
    index: 'sushi',
    q: 'id:' + sushi.id.toString()
  });

};
