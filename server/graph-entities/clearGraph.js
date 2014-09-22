'use strict';
var fromStream = require('co-from-stream');
var cypher = require('cypher-stream')('http://localhost:7474');


/**
 * Clear neo4j graph
 */
module.exports = function *()
{
  // first remove all neo4j graph nodes
  var deleteAll = fromStream(cypher('MATCH (n) '
                                  + 'OPTIONAL MATCH (n)-[r]-() '
                                  + 'DELETE n,r'));
  while(yield deleteAll());

  yield deleteAll(true);
};
