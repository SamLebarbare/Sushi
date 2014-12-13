'use strict';
var config = require('../config/config');
var fromStream = require('co-from-stream');
var cypher = require('cypher-stream')(config.neo4j.url);


/**
 * Create user in neo4j
 * id property must be cleaned from mongo documents (ex. _id -> id)
 * @param user mongodb user entity
 */
module.exports = function *(user)
{
  // create user
  var transaction = cypher.transaction();
  var params = { data :
    {
      uid : user.id,
    }
  };

  var query = 'CREATE (u:User { data } );';

  transaction.write({statement: query, parameters: params});
  transaction.commit();

  var createUser = fromStream(transaction);
  while (yield createUser());
};
