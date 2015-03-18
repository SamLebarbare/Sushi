'use strict';
var config = require('../config/config');
var fromStream = require('co-from-stream');
var cypher = require('cypher-stream')(config.neo4j.url);


/**
 * Clear neo4j graph
 */
module.exports = function *(sushi)
{
  var transaction = cypher.transaction();
  var query =                     "MATCH (n:Sushi) "
                                  + "WHERE n.bid = '" + sushi.id + "' "
                                  + "OPTIONAL MATCH (n)-[r]-() "
                                  + "DELETE n,r;";

  transaction.write(query);
  transaction.commit();
  var deleteSushi = fromStream(transaction);
  while(yield deleteSushi());
};
