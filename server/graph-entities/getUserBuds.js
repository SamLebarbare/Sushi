'use strict';
var config = require('../config/config');
var mongo = require('../config/mongo');
var fromStream = require('co-from-stream');
var cypher = require('../../cypher-stream')(config.neo4j.url);


/**
 * Return all viewable buds for a user
 * id property must be cleaned from mongo documents (ex. _id -> id)
 * @param user mongodb user entity
 * @param bud mongodb bud entity
 */
module.exports = function *(user)
{
  var ObjectID = mongo.ObjectID;
  var result = [];
  var data;
  var query = "MATCH (bud:Bud) " +
              "WHERE bud.creatorId = " + user.id + " " +
              "RETURN bud.id " +
              "UNION " +
              "MATCH (bud:Bud)-[:SHARED_TO]->(user:User) " +
              "WHERE user.id = " + user.id + " " +
              "RETURN bud.id";


  var userBuds = fromStream(cypher(query));

  while (data = yield userBuds())
  {
    result.push(new ObjectID(data['bud.id']));
  }
  return result;

};
