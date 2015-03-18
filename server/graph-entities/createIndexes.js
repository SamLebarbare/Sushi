'use strict';
var config     = require('../config/config');
var fromStream = require('co-from-stream');
var cypher     = require('cypher-stream')(config.neo4j.url);


/**
 * Create indexes
 */
module.exports = function *()
{
  var transaction = cypher.transaction();
  console.log(config.neo4j.url);
  // first remove all neo4j graph nodes

  var sushiIndex = 'CREATE INDEX ON :Sushi(bid);';
  var userIndex = 'CREATE INDEX ON :User(uid);';

  transaction.write(sushiIndex);
  transaction.write(userIndex);
  transaction.commit();
  var createIndexes = fromStream(transaction)
  while(yield createIndexes());

};
