'use strict';
var config = require('../config/config');
var fromStream = require('co-from-stream');
var cypher = require('cypher-stream')(config.neo4j.url);


/**
 * Remove User - *REL -> Sushi
 * id property must be cleaned from mongo documents (ex. _id -> id)
 * @param user mongodb user entity
 * @param sushi mongodb sushi entity
 */
module.exports = function *(user, sushi, rel)
{
  var transaction = cypher.transaction();
  var query = "MATCH (u:User { uid: " + user.id
  + " })-[r:" + rel +"]->(b:Sushi { bid: '" + sushi.id + "' }) "
  +"DELETE r;";
  console.log(query);

  transaction.write(query);
  transaction.commit();
  var deleteRel = fromStream(transaction);
  while(yield deleteRel());

};
