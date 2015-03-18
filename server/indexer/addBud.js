'use strict';
var client        = require('./es-client');

module.exports = function *(sushi)
{

  yield client.index({
    index: 'sushi',
    type: 'sushi',
    id: sushi.id.toString(),
    body: {
      id: sushi.id,
      title: sushi.title,
      content: sushi.content
    }
  });

};
