'use strict';
var fromStream = require('co-from-stream');
var cypher = require('cypher-stream')('http://localhost:7474');


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

  var query = "MATCH (a:Bud),(b:User) "
  +"WHERE a.id = '" + bud.id + "' AND b.id = " + user.id
  +" CREATE (b)-[:CREATED]->(a)";
  console.log(query);
  var createRel = fromStream(cypher(query));
  yield createRel(true);
};
