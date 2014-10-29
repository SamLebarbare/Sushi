'use strict';
var config = require('../config/config');
var fromStream = require('co-from-stream');
var cypher = require('../../cypher-stream')(config.neo4j.url);


/**
 * Create Bud - *REL -> User
 * id property must be cleaned from mongo documents (ex. _id -> id)
 * @param user mongodb user entity
 * @param bud mongodb bud entity
 */
module.exports = function *(user, bud, rel)
{
  var query = "MATCH (b:Bud),(u:User) "
  +"WHERE b.bid = '" + bud.id + "' AND u.uid = " + user.id
  +" CREATE (b)-[:" + rel + "]->(u);";
  console.log(query);
  var createRel = fromStream(cypher(query));
  while(yield createRel());
};
