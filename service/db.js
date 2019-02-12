// mongodb
let MongoClient = require('mongodb').MongoClient;
let assert = require('assert');
let credentials = require('../credentials');

// for testing
let mockObj = {
    test: "#FALNATION",
    anotherTest: 420,
    players: [{
        name: "Eoin",
        player: true
    }, {
        name: "Fal",
        favoriteThing: "beer"
    }],
    fal: true
};

/* db utilities */
let client = null;
let db = null;
let collection = null;

// initializes the
// db connection
module.exports.init = function(url) {
    return new Promise((resolve, reject) => {
        console.log('Connecting to db...');
        MongoClient.connect(url).then((response) => {
            console.log('Connection to db successful...');
            client = response;
            db = response.db(credentials.mongo.dbs.dbTest);
            collection = db.collection(credentials.mongo.collections.collectionTest);
            let config = {
                client:client,
                db:db,
                collection:collection
            };
            resolve(config);
        }).catch((err) => {
            reject(err);
        });
    });
};

module.exports.getDb = () => {
    return db;
};

module.exports.getCollection = () => {
    return collection;
};

module.exports.getClient = () => {
    return client;
};

