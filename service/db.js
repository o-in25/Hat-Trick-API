// mongodb
let MongoClient = require('mongodb');
let assert = require('assert');

// set up db
let password = '';
let username = '';
const url = 'mongodb://' +  username + ':' + password + '@hattrickcluster-shard-00-00-zgcgc.mongodb.net:27017,hattrickcluster-shard-00-01-zgcgc.mongodb.net:27017,hattrickcluster-shard-00-02-zgcgc.mongodb.net:27017/test?ssl=true&replicaSet=HatTrickCluster-shard-0&authSource=admin&retryWrites=true';

let db;

module.exports = {
    establishConnection: function (callback) {
        MongoClient.connect(url).then((data) => {
            db = data;
            callback();
        }).catch(function (err) {
            callback(err);
        });
    },
    db: function () {
      return db;
    }
};
