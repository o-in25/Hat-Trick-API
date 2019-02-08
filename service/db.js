// mongodb
let MongoClient = require('mongodb').MongoClient;
let assert = require('assert');
let credentials = require('../credentials');
// the connection string
const url = 'mongodb://' +  credentials.mongo.username + ':' + credentials.mongo.password + '@hattrickcluster-shard-00-00-zgcgc.mongodb.net:27017,hattrickcluster-shard-00-01-zgcgc.mongodb.net:27017,hattrickcluster-shard-00-02-zgcgc.mongodb.net:27017/test?ssl=true&replicaSet=HatTrickCluster-shard-0&authSource=admin&retryWrites=true';

// set up db
let db;

module.exports = {
    testInsert: function() {
       let dbName = 'HatTrickDB';
       let client = new MongoClient();
       client.connect(function(err) {
           console.log('Connected to sever');
           const db = client.db(dbName);

           const collection = db.collection('PlayerStats');
           collection.insertMany([{
               test: "Hello Fal!"
           }], function(err, result) {
               if(err) {
                   console.log(err);
               } else {
                   console.log(result);
               }
           });
       });
    },
    _testInsert: function() {
        MongoClient.connect(url).then((client) => {
            const collection = client.db('HatTrickDB').collection('PlayerStats');
            collection.insertMany([{
                test: "#FALNATION"
            }]).then((res) => {
                console.log(res);
            }).catch((err) => {
                throw new Error(err);
            });
        }).catch((err) => {
            throw new Error(err);

        });
    },

    db: function() {
      return db;
    }
};
