'use strict';
var config = require('../config/config');
var fromStream = require('co-from-stream');
var cypher = require('cypher-stream')(config.neo4j.url);


/**
 * Remove User - FOLLOW -> Bud
 * id property must be cleaned from mongo documents (ex. _id -> id)
 * @param user mongodb user entity
 * @param bud mongodb bud entity
 */
module.exports = function *(user, bud)
{
  var query = "MATCH (u:User { id: " + user.id
  + " })-[r:FOLLOW]->(b:Bud { id: '" + bud.id + "' }) "
  +"DELETE r";
  console.log(query);
  var deleteRel = fromStream(cypher(query));
  yield deleteRel(true);
};
