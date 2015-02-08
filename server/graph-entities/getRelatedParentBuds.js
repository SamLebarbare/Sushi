'use strict';
var config = require('../config/config');
var mongo = require('../config/mongo');
var fromStream = require('co-from-stream');
var cypher = require('cypher-stream')(config.neo4j.url);


/**
 * Return parent buds
 * id property must be cleaned from mongo documents (ex. _id -> id)
 * @param user mongodb user entity
 * @param bud mongodb bud entity
 */
module.exports = function *(budId, type)
{
  var transaction = cypher.transaction();
  var ObjectID = mongo.ObjectID;
  var result = [];
  var data;
  var query = "MATCH (bud:Bud)-[:PARENT]-(parent:" + type +") " +
              "WHERE bud.bid = '" + budId + "' " +
              "RETURN parent.bid "

  transaction.write(query);
  transaction.commit();

  var relatedBuds = fromStream(transaction);



  while (data = yield relatedBuds())
  {
    result.push(new ObjectID(data['parent.bid']));
  }
  console.log('PARENTS: ' + result);
  return result;

};
