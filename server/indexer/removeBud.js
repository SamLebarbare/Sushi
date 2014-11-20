'use strict';
var client        = require('./client');

module.exports = function *(bud)
{

  yield client.deleteByQuery({
    index: 'bud',
    q: 'id:' + bud.id.toString()
  });

};
