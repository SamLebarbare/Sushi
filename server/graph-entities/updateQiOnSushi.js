'use strict';
var config = require('../config/config');
var fromStream = require('co-from-stream');
var cypher = require('cypher-stream')(config.neo4j.url);


/**
 * Add Qi on a sushi, refresh qi value with 0, or remove qi with negative value
 * id property must be cleaned from mongo documents (ex. _id -> id)
 * @param addedQi the value to add/remove
 * @param sushi mongodb sushi entity
 */
module.exports = function *(user, sushi, addedQi)
{

  var transaction = cypher.transaction();
  var data, result = [];
  var query1 =  "MATCH (sushi:Sushi) " +
  	          "WHERE sushi.bid = '" + sushi.id + "' " +
  		        "OPTIONAL MATCH " +
              "(user:User)-[su:SUPPORT]->(sushi:Sushi), " +
              "(user:User)-[fo:FOLLOW]->(sushi:Sushi), " +
              "(user:User)-[sp:SPONSOR]->(sushi:Sushi) " +
              "WHERE sushi.bid = '" + sushi.id + "' " +
              "WITH user, sushi, " +
              "count(su) AS su_qi, " +
              "count(fo) AS fo_qi, " +
              "count(sp) AS sp_qi " +
              "SET sushi.qi = sushi.qi + su_qi + fo_qi + sp_qi + " + addedQi + ";";


  var query2 = "MATCH (sushi:Sushi) WHERE sushi.bid = '" + sushi.id + "' " +
               "RETURN sushi.qi";

  transaction.write(query1);
  transaction.write(query2);
  transaction.commit();


  var getQi = fromStream(transaction);
  while (data = yield getQi())
  {
    console.log(data['sushi.qi']);
    result.push(data['sushi.qi']);
  }

  return result[0];
};
