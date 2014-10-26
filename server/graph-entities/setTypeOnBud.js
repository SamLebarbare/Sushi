'use strict';
var config = require('../config/config');
var fromStream = require('co-from-stream');
var cypher = require('../../cypher-stream')(config.neo4j.url);


/**
 * Set bud type as new label on the node 
 * id property must be cleaned from mongo documents (ex. _id -> id)
 * @param addedQi the value to add/remove
 * @param bud mongodb bud entity
 */
module.exports = function *(user, bud, type)
{


 var data, result = [];
 var query =  "MATCH (bud:Bud) " +
		          "WHERE bud.id = '" + bud.id + "' " +
              "SET bud :" + type;

  console.log(query);
  var setType = fromStream(cypher(query));
  yield setType(true);
};
