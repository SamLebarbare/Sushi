'use strict';
var fromStream = require('co-from-stream');
var cypher = require('cypher-stream')('http://localhost:7474');


/**
 * Create user in neo4j
 * id property must be cleaned from mongo documents (ex. _id -> id)
 * @param user mongodb user entity
 */
module.exports = function *(user)
{
  // create user
  var params = { data :
    {
      id : user.id,
    }
  };
  
  var createUser = fromStream(cypher('CREATE (u:User { data } )',params));
  yield createUser(true);
};
