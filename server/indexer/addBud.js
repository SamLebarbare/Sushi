'use strict';
var client        = require('./es-client');

module.exports = function *(bud)
{

  yield client.index({
    index: 'bud',
    type: 'bud',
    id: bud.id.toString(),
    body: {
      id: bud.id,
      title: bud.title,
      content: bud.content
    }
  });

};
