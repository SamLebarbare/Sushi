'use strict';
var config     = require('../config/config');
var fromStream = require('co-from-stream');
var cypher     = require('../../cypher-stream')(config.neo4j.url);


/**
 * Create indexes
 */
module.exports = function *()
{
  console.log(config.neo4j.url);
  // first remove all neo4j graph nodes
  var budIndex = fromStream(cypher('CREATE INDEX ON :Bud(bid);'));
  while(yield budIndex());

  var userIndex = fromStream(cypher('CREATE INDEX ON :User(uid);'));
  while(yield userIndex());

};
