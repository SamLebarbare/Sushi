'use strict';
var config = require('../config/config');
var fromStream = require('co-from-stream');
var cypher = require('cypher-stream')(config.neo4j.url);


/**
 * Set bud type as new label on the node
 * id property must be cleaned from mongo documents (ex. _id -> id)
 * @param addedQi the value to add/remove
 * @param bud mongodb bud entity
 */
module.exports = function *(user, bud, type)
{

  var transaction = cypher.transaction();
  var data, result = [];
  var query =  "MATCH (bud:Bud) " +
  	          "WHERE bud.bid = '" + bud.id + "' " +
              "SET bud :" + type +";";

  console.log(query);
  transaction.write(query);
  transaction.commit();
  var setType = fromStream(transaction);
  yield setType(true);
};
