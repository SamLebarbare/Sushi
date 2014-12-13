'use strict';
var config = require('../config/config');
var fromStream = require('co-from-stream');
var cypher = require('cypher-stream')(config.neo4j.url);


/**
 * Clear neo4j graph
 */
module.exports = function *(bud)
{
  var transaction = cypher.transaction();
  var query =                     "MATCH (n:Bud) "
                                  + "WHERE n.bid = '" + bud.id + "' "
                                  + "OPTIONAL MATCH (n)-[r]-() "
                                  + "DELETE n,r;";

  transaction.write(query);
  transaction.commit();
  var deleteBud = fromStream(transaction);
  while(yield deleteBud());
};
