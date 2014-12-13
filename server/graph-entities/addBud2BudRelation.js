'use strict';
var config = require('../config/config');
var fromStream = require('co-from-stream');
var cypher = require('cypher-stream')(config.neo4j.url);


/**
 * Create Bud - *REL -> Bud
 * id property must be cleaned from mongo documents (ex. _id -> id)
 * @param user mongodb user entity
 * @param bud mongodb bud entity
 */
module.exports = function *(bud1, bud2, rel)
{
  var transaction = cypher.transaction();
  var query = "MATCH (b:Bud),(s:Bud) "
  +"WHERE b.bid = '" + bud1.id + "' "
  +"AND   s.bid = '" + bud2.id + "' "
  +" CREATE (b)-[:" + rel + "]->(s);";
  console.log(query);
  transaction.write(query);
  transaction.commit();
  var createRel = fromStream(transaction);
  while(yield createRel());
};
