'use strict';
var config = require('../config/config');
var fromStream = require('co-from-stream');
var cypher = require('../../cypher-stream')(config.neo4j.url);


/**
 * Create a bud in neo4j with CREATED rel. on creator
 * id property must be cleaned from mongo documents (ex. _id -> id)
 * @param user mongodb user entity
 * @param bud mongodb bud entity
 */
module.exports = function *(user, bud)
{
  // create neo4j nodes for buds
  var params = { data :
    {
      id : bud.id,
      creatorId : user.id,
      privacy : bud.privacy
    }
  };

  var createBud = fromStream(cypher('CREATE (b:Bud { data } )',params));
  yield createBud(true);

  var query = "MATCH (b:Bud),(u:User) "
  +"WHERE b.id = '" + bud.id + "' AND u.id = " + user.id
  +" CREATE (u)-[:CREATED]->(b)";
  console.log(query);
  var createRel = fromStream(cypher(query));
  yield createRel(true);
};
