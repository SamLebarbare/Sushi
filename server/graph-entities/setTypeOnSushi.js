'use strict';
var config = require('../config/config');
var fromStream = require('co-from-stream');
var cypher = require('cypher-stream')(config.neo4j.url);


/**
 * Set sushi type as new label on the node
 * id property must be cleaned from mongo documents (ex. _id -> id)
 * @param addedQi the value to add/remove
 * @param sushi mongodb sushi entity
 */
module.exports = function *(user, sushi, type)
{

  var transaction = cypher.transaction();
  var data, result = [];
  var query =  "MATCH (sushi:Sushi) " +
  	          "WHERE sushi.bid = '" + sushi.id + "' " +
              "SET sushi :" + type +";";

  console.log(query);
  transaction.write(query);
  transaction.commit();
  var setType = fromStream(transaction);
  yield setType(true);
};
