'use strict';
var config = require('../config/config');
var fromStream = require('co-from-stream');
var cypher = require('cypher-stream')(config.neo4j.url);


/**
 * Add Qi on a bud, refresh qi value with 0, or remove qi with negative value
 * id property must be cleaned from mongo documents (ex. _id -> id)
 * @param addedQi the value to add/remove
 * @param bud mongodb bud entity
 */
module.exports = function *(user, bud, addedQi)
{

  var transaction = cypher.transaction();
  var data, result = [];
  var query1 =  "MATCH (bud:Bud) " +
  	          "WHERE bud.bid = '" + bud.id + "' " +
  		        "OPTIONAL MATCH " +
              "(user:User)-[su:SUPPORT]->(bud:Bud), " +
              "(user:User)-[fo:FOLLOW]->(bud:Bud), " +
              "(user:User)-[sp:SPONSOR]->(bud:Bud) " +
              "WHERE bud.bid = '" + bud.id + "' " +
              "WITH user, bud, " +
              "count(su) AS su_qi, " +
              "count(fo) AS fo_qi, " +
              "count(sp) AS sp_qi " +
              "SET bud.qi = bud.qi + su_qi + fo_qi + sp_qi + " + addedQi + ";";


  var query2 = "MATCH (bud:Bud) WHERE bud.bid = '" + bud.id + "' " +
               "RETURN bud.qi";

  transaction.write(query1);
  transaction.write(query2);
  transaction.commit();


  var getQi = fromStream(transaction);
  while (data = yield getQi())
  {
    console.log(data['bud.qi']);
    result.push(data['bud.qi']);
  }

  return result[0];
};
