'use strict';
var config = require('../config/config');
var mongo = require('../config/mongo');
var fromStream = require('co-from-stream');
var cypher = require('cypher-stream')(config.neo4j.url);


/**
 * Return child sushis
 * id property must be cleaned from mongo documents (ex. _id -> id)
 * @param user mongodb user entity
 * @param sushi mongodb sushi entity
 */
module.exports = function *(sushiId, type)
{
  var transaction = cypher.transaction();
  var ObjectID = mongo.ObjectID;
  var result = [];
  var data;
  var query = "MATCH (sushi:Sushi)-[:CHILD]-(child:" + type +") " +
              "WHERE sushi.bid = '" + sushiId + "' " +
              "RETURN child.bid "

  transaction.write(query);
  transaction.commit();

  var relatedSushis = fromStream(transaction);



  while (data = yield relatedSushis())
  {
    result.push(new ObjectID(data['child.bid']));
  }
  console.log('CHILDS: ' + result);
  return result;

};
