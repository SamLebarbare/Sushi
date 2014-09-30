'use strict';
var config = require('../config/config');
var fromStream = require('co-from-stream');
var cypher = require('../../cypher-stream')(config.neo4j.url);


/**
 * Add Qi on a bud, refresh qi value with 0, or remove qi with negative value
 * id property must be cleaned from mongo documents (ex. _id -> id)
 * @param addedQi the value to add/remove
 * @param bud mongodb bud entity
 */
module.exports = function *(user, bud, addedQi)
{


 var data, result = [];
 var query =  "MATCH (bud:Bud) " +
		          "WHERE bud.id = '" + bud.id + "' " +
			        "OPTIONAL MATCH " +
              "(user:User)-[su:SUPPORT]->(bud:Bud), " +
              "(user:User)-[fo:FOLLOW]->(bud:Bud), " +
              "(user:User)-[sp:SPONSOR]->(bud:Bud) " +
              "WHERE bud.id = '" + bud.id + "' " +
              "WITH user, bud, " +
              "count(*) AS qi " +
              "SET bud.qi = qi + " + addedQi;



  console.log(query);
  var addQi = fromStream(cypher(query));
  yield addQi(true);

  query = "MATCH (bud:Bud) WHERE bud.id = '" + bud.id + "' " +
          "RETURN bud.qi";

  var getQi = fromStream(cypher(query));
  while (data = yield getQi())
  {
    result.push(data['bud.qi']);
  }

  return result[0];
};
