'use strict';
var config = require('../config/config');
var fromStream = require('co-from-stream');
var cypher = require('cypher-stream')(config.neo4j.url);


/**
 * Create Sushi - *REL -> Sushi
 * id property must be cleaned from mongo documents (ex. _id -> id)
 * @param user mongodb user entity
 * @param sushi mongodb sushi entity
 */
module.exports = function *(sushi1, sushi2, rel)
{
  var transaction = cypher.transaction();
  var query = "MATCH (b:Sushi),(s:Sushi) "
  +"WHERE b.bid = '" + sushi1.id + "' "
  +"AND   s.bid = '" + sushi2.id + "' "
  +" CREATE (b)-[:" + rel + "]->(s);";
  console.log(query);
  transaction.write(query);
  transaction.commit();
  var createRel = fromStream(transaction);
  while(yield createRel());
};
