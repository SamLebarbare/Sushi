'use strict';
var config = require('../config/config');
var mongo = require('../config/mongo');
var fromStream = require('co-from-stream');
var cypher = require('cypher-stream')(config.neo4j.url);


/**
 * Return all viewable buds for a user
 * id property must be cleaned from mongo documents (ex. _id -> id)
 * @param user mongodb user entity
 * @param bud mongodb bud entity
 */
module.exports = function *(user)
{
  var transaction = cypher.transaction();
  var ObjectID = mongo.ObjectID;
  var result = [];
  var data;
  var query = "MATCH (bud:Bud) " +
              "WHERE bud.creatorId = " + user.id + " " +
              "RETURN bud.bid " +
              "UNION " +
              "MATCH (bud:Bud)<-[:ACTOR]-(user:User) " +
              "WHERE user.uid = " + user.id + " " +
              "RETURN bud.bid " +
              "UNION " +
              "MATCH (bud:Bud)-[:SHARED_TO]->(user:User) " +
              "WHERE user.uid = " + user.id + " " +
              "RETURN bud.bid " +
              "UNION " +
              "MATCH (bud:Bud)<-[:MEMBER]-(user:User) " +
              "WHERE user.uid = " + user.id + " " +
              "RETURN bud.bid;";

  transaction.write(query);
  transaction.commit();
  var userBuds = fromStream(transaction);

  while (data = yield userBuds())
  {
    result.push(new ObjectID(data['bud.bid']));
  }
  return result;

};
