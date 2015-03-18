'use strict';
var config = require('../config/config');
var mongo = require('../config/mongo');
var fromStream = require('co-from-stream');
var cypher = require('cypher-stream')(config.neo4j.url);


/**
 * Return all sushi teams
 */
module.exports = function *()
{
  var transaction = cypher.transaction();
  var ObjectID = mongo.ObjectID;
  var result = [];
  var data;
  var query = "MATCH (sushi:Team) " +
              "RETURN sushi.bid;"

  transaction.write(query);
  transaction.commit();

  var teams = fromStream(transaction);

  while (data = yield teams())
  {
    result.push(new ObjectID(data['sushi.bid']));
  }
  return result;

};
