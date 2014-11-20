var elasticsearch = require('elasticsearch');
var config        = require('../config/config');

var client = function () {};
client.instance = null;

client.getInstance = function(){
    if(this.instance === null){
        this.instance = new elasticsearch.Client(config.es);
    }
    return this.instance;
}

module.exports = client.getInstance();
