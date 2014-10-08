'use strict';
var config = require('../config/config');
var fromStream = require('co-from-stream');
var cypher = require('../../cypher-stream')(config.neo4j.url);


/**
 * Create Bud - *REL -> Bud
 * id property must be cleaned from mongo documents (ex. _id -> id)
 * @param user mongodb user entity
 * @param bud mongodb bud entity
 */
module.exports = function *(bud1, bud2, rel)
{
  var query = "MATCH (b:Bud),(s:Bud) "
  +"WHERE b.id = '" + bud1.id + "' "
  +"AND   s.id = '" + bud2.id + "' "
  +" CREATE (b)-[:" + rel + "]->(s)";
  console.log(query);
  var createRel = fromStream(cypher(query));
  while(yield createRel());
};
