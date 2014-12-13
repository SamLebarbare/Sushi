'use strict';
var config = require('../config/config');
var fromStream = require('co-from-stream');
var cypher = require('cypher-stream')(config.neo4j.url);


/**
 * Create a bud in neo4j with CREATED rel. on creator
 * id property must be cleaned from mongo documents (ex. _id -> id)
 * @param user mongodb user entity
 * @param bud mongodb bud entity
 */
module.exports = function *(user, bud)
{
  // create neo4j nodes for buds
  var transaction = cypher.transaction();
  var params = { data :
    {
      bid : bud.id,
      qi: bud.qi,
      creatorId : user.id,
      privacy : bud.privacy
    }
  };

  var query = 'CREATE (b:Bud { data } );';

  transaction.write({statement: query, parameters: params});
  transaction.commit();

  var createBud = fromStream(transaction);
  while(yield createBud());
  console.log('BUD CREATED');
};
