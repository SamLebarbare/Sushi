'use strict';
var config = require('../config/config');
var fromStream = require('co-from-stream');
var cypher = require('cypher-stream')(config.neo4j.url);


/**
 * Create a sushi in neo4j with CREATED rel. on creator
 * id property must be cleaned from mongo documents (ex. _id -> id)
 * @param user mongodb user entity
 * @param sushi mongodb sushi entity
 */
module.exports = function *(user, sushi)
{
  // create neo4j nodes for sushis
  var transaction = cypher.transaction();
  var params = { data :
    {
      bid : sushi.id,
      qi: sushi.qi,
      creatorId : user.id,
      privacy : sushi.privacy
    }
  };

  var query = 'CREATE (b:Sushi { data } );';

  transaction.write({statement: query, parameters: params});
  transaction.commit();

  var createSushi = fromStream(transaction);
  while(yield createSushi());
  console.log('BUD CREATED');
};
