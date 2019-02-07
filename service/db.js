// mongodb
let MongoClient = require('mongodb');
let assert = require('assert');
let credentials = require('../credentials');

// the connection string
const url = 'mongodb://' +  credentials.mongo.username + ':' + credentials.mongo.password + '@hattrickcluster-shard-00-00-zgcgc.mongodb.net:27017,hattrickcluster-shard-00-01-zgcgc.mongodb.net:27017,hattrickcluster-shard-00-02-zgcgc.mongodb.net:27017/test?ssl=true&replicaSet=HatTrickCluster-shard-0&authSource=admin&retryWrites=true';

// set up db
let db;

module.exports = {
    establishConnection: function(callback) {
        MongoClient.connect(url).then((data) => {
            db = data;
            callback();
        }).catch(function(err) {
            callback(err);
        });
    },
    db: function() {
      return db;
    }
};
