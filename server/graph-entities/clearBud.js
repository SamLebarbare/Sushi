'use strict';
var config = require('../config/config');
var fromStream = require('co-from-stream');
var cypher = require('../../cypher-stream')(config.neo4j.url);


/**
 * Clear neo4j graph
 */
module.exports = function *(bud)
{
  var deleteBud = fromStream(cypher("MATCH (n:Bud) "
                                  + "WHERE n.bid = '" + bud.id + "' "
                                  + "OPTIONAL MATCH (n)-[r]-() "
                                  + "DELETE n,r;"));
  while(yield deleteBud());
};
