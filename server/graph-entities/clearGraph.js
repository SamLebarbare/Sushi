'use strict';
var config = require('../config/config');
var fromStream = require('co-from-stream');
var cypher = require('cypher-stream')(config.neo4j.url);


/**
 * Clear neo4j graph
 */
module.exports = function *()
{
  var transaction = cypher.transaction();
  console.log(config.neo4j.url);
  // first remove all neo4j graph nodes
  var query =                     'MATCH (n) '
                                  + 'OPTIONAL MATCH (n)-[r]-() '
                                  + 'DELETE n,r;';

  transaction.write(query);
  transaction.commit();
  var deleteAll = fromStream(transaction);
  while(yield deleteAll());
};
