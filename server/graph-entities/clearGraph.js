'use strict';
var config = require('../config/config');
var fromStream = require('co-from-stream');
var cypher = require('../../cypher-stream')(config.neo4j.url);


/**
 * Clear neo4j graph
 */
module.exports = function *()
{
  console.log(config.neo4j.url);
  // first remove all neo4j graph nodes
  var deleteAll = fromStream(cypher('MATCH (n) '
                                  + 'OPTIONAL MATCH (n)-[r]-() '
                                  + 'DELETE n,r'));
  while(yield deleteAll());
};
