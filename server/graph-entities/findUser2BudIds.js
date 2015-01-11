'use strict';
var config = require('../config/config');
var mongo = require('../config/mongo');
var fromStream = require('co-from-stream');
var cypher = require('cypher-stream')(config.neo4j.url);


/**
 * Return all buds for a user with a typed relation
 * id property must be cleaned from mongo documents (ex. _id -> id)
 */
module.exports = function *(userId, type)
{
  var transaction = cypher.transaction();
  var ObjectID = mongo.ObjectID;
  var result = [];
  var data;
  var query = "MATCH (bud:Bud)<-[:" + type + "]-(user:User) " +
              "WHERE user.uid = " + userId + " " +
              "RETURN bud.bid;"

  transaction.write(query);
  transaction.commit();

  var teams = fromStream(transaction);

  while (data = yield teams())
  {
    result.push(new ObjectID(data['bud.bid']));
  }
  return result;

};
