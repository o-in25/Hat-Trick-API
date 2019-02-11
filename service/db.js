// mongodb
let events = require('events');
let MongoClient = require('mongodb').MongoClient;
let assert = require('assert');
let credentials = require('../credentials');
// the connection string
let event = new events.EventEmitter();
let delay = 300;
let attempts = 0;


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
            db = response.db('HatTrickDB');
            collection = response.db('HatTrickDB').collection('PlayerStatsT');
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


/*
Insert
 */
module.exports.insert = function(collection, documents, options) {
    return new Promise((resolve, reject) => {
        if(!collection) {
            reject(new Error('Collection cannot be undefined'));
        } else {
            if(typeof documents != "object" && !documents.hasOwnProperty('length')) {
                reject(new Error('Document must be of type array'));
            } else {
                collection.insertMany(documents, options).then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
            }
        }
    })
};


module.exports.insertOne = function(doc, options, callback, collection) {
    collection.insertOne(doc, options).then((res) => {
        // sucess
        callback(res);
    }).catch((err) => {
        throw new Error(err);
    });
};


// just a test
module.exports.testInsert = function() {
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
};
