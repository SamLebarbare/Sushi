'use strict';
var config = require('../config/config');
var fromStream = require('co-from-stream');
var cypher = require('cypher-stream')(config.neo4j.url);


/**
 * Create User - *REL -> Bud
 * id property must be cleaned from mongo documents (ex. _id -> id)
 * @param user mongodb user entity
 * @param bud mongodb bud entity
 */
module.exports = function *(user, bud, rel)
{
  var transaction = cypher.transaction();
  var query = "MATCH (b:Bud),(u:User) "
  +"WHERE b.bid = '" + bud.id + "' AND u.uid = " + user.id
  +" CREATE (u)-[:" + rel + "]->(b);";
  console.log(query);
  transaction.write(query);
  transaction.commit();
  var createRel = fromStream(transaction);
  while(yield createRel());
};
