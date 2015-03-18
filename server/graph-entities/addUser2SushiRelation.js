'use strict';
var config = require('../config/config');
var fromStream = require('co-from-stream');
var cypher = require('cypher-stream')(config.neo4j.url);


/**
 * Create User - *REL -> Sushi
 * id property must be cleaned from mongo documents (ex. _id -> id)
 * @param user mongodb user entity
 * @param sushi mongodb sushi entity
 */
module.exports = function *(user, sushi, rel)
{
  var transaction = cypher.transaction();
  var query = "MATCH (b:Sushi),(u:User) "
  +"WHERE b.bid = '" + sushi.id + "' AND u.uid = " + user.id
  +" CREATE (u)-[:" + rel + "]->(b);";
  console.log(query);
  transaction.write(query);
  transaction.commit();
  var createRel = fromStream(transaction);
  while(yield createRel());
};
