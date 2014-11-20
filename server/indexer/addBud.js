'use strict';
var client        = require('./client');

module.exports = function *(bud)
{

  yield client.index({
    index: 'bud',
    type: bud.type,
    id: bud.id.toString(),
    body: {
      id: bud.id,
      title: bud.title,
      content: bud.content
    }
  });

};
