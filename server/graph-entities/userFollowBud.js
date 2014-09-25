'use strict';
var config = require('../config/config');
var fromStream = require('co-from-stream');
var cypher = require('../../cypher-stream')(config.neo4j.url);


/**
 * Create User - FOLLOW -> Bud
 * id property must be cleaned from mongo documents (ex. _id -> id)
 * @param user mongodb user entity
 * @param bud mongodb bud entity
 */
module.exports = function *(user, bud)
{
  var query = "MATCH (b:Bud),(u:User) "
  +"WHERE b.id = '" + bud.id + "' AND u.id = " + user.id
  +" CREATE (u)-[:FOLLOW]->(b)";
  console.log(query);
  var createRel = fromStream(cypher(query));
  yield createRel(true);
};
