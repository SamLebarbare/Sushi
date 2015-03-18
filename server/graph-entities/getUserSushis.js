'use strict';
var config = require('../config/config');
var mongo = require('../config/mongo');
var fromStream = require('co-from-stream');
var cypher = require('cypher-stream')(config.neo4j.url);


/**
 * Return all viewable sushis for a user
 * id property must be cleaned from mongo documents (ex. _id -> id)
 * @param user mongodb user entity
 * @param sushi mongodb sushi entity
 */
module.exports = function *(user)
{
  var transaction = cypher.transaction();
  var ObjectID = mongo.ObjectID;
  var result = [];
  var data;
  var query = "MATCH (sushi:Sushi) " +
              "WHERE sushi.creatorId = " + user.id + " " +
              "RETURN sushi.bid " +
              "UNION " +
              "MATCH (sushi:Sushi)<-[:ACTOR]-(user:User) " +
              "WHERE user.uid = " + user.id + " " +
              "RETURN sushi.bid " +
              "UNION " +
              "MATCH (sushi:Sushi)-[:SHARED_TO]->(user:User) " +
              "WHERE user.uid = " + user.id + " " +
              "RETURN sushi.bid " +
              "UNION " +
              "MATCH (sushi:Sushi)<-[:FOLLOW]-(user:User) " +
              "WHERE user.uid = " + user.id + " " +
              "RETURN sushi.bid " +
              "UNION " +
              "MATCH (sushi:Sushi)<-[:MEMBER]-(user:User) " +
              "WHERE user.uid = " + user.id + " " +
              "RETURN sushi.bid;";

  transaction.write(query);
  transaction.commit();
  var userSushis = fromStream(transaction);

  while (data = yield userSushis())
  {
    result.push(new ObjectID(data['sushi.bid']));
  }
  return result;

};
