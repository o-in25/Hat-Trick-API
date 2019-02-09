// mongodb
let MongoClient = require('mongodb').MongoClient;
let assert = require('assert');
let credentials = require('../credentials');
// the connection string
const url = 'mongodb://' +  credentials.mongo.username + ':' + credentials.mongo.password + '@hattrickcluster-shard-00-00-zgcgc.mongodb.net:27017,hattrickcluster-shard-00-01-zgcgc.mongodb.net:27017,hattrickcluster-shard-00-02-zgcgc.mongodb.net:27017/test?ssl=true&replicaSet=HatTrickCluster-shard-0&authSource=admin&retryWrites=true';

// set up db
let db;
let client;
let collection;

// for testing
let mockObj = {
    test: "#FALNATION, FAL!!",
    anotherTest: 420,
    players: [{
        name: "Eoin",
        player: true
    }, {
        name: "Fal",
        favoriteThing: "smoking weed"
    }],
    fal: true
};


module.exports = {
    connection: function(_url, _db, _collection, arr) {
        console.log('Starting');
        MongoClient.connect(url).then((_client) => {
            console.log('Conneted');
            client = _client;
            db = _client.db(_db);
            collection = db.collection(_collection);

            collection.insertMany([JSON.parse(arr)], {}).then((res) => {
                // sucess
                console.log('Done');
            }).catch((err) => {
                console.log('Failed to insert documents, cause: ' + err);
            });
        }).catch((err) => {
            console.log("Error: " + err);
        });
    },
    // accessor methods
    // for use after
    // connection
    db: function() {
        return db;
    },
    client: function() {
        return client;
    },
    collection: function() {
        return collection;
    },
    _insertMany: function(arr, options, callback) {
        /*
        let docs = [];
        for(let el in arr) {
            if(typeof el !== undefined || !el) {
                // ad the doc
                docs.push(el);
            }
        }
         */
       collection.insertMany([arr], options).then((res) => {
           // sucess
           callback(res);
       }).catch((err) => {
           throw new Error(err);
       });
    },
    _insertOne: function(doc, options, callback) {
        collection().insertOne(doc, options).then((res) => {
            // sucess
            callback(res);
        }).catch((err) => {
            throw new Error(err);
        });
    },





    // just a test
    _testInsert: function() {
        console.log(this);
        MongoClient.connect(url).then((client) => {
            const collection = client.db('HatTrickDB').collection('PlayerStats');
            collection.insertMany([mockObj]).then((res) => {
                console.log(res);
            }).catch((err) => {
                throw new Error(err);
            });
        }).catch((err) => {
            throw new Error(err);

        });
    },
};
