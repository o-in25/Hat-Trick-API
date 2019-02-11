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

let client = null;
let db = null;
let collection = null;


module.exports.connect = function() {
    setTimeout(init, delay);
    function init() {
        console.log('Connecting to db...');
        const url = 'mongodb://' +  credentials.mongo.username + ':' + credentials.mongo.password + '@hattrickcluster-shard-00-00-zgcgc.mongodb.net:27017,hattrickcluster-shard-00-01-zgcgc.mongodb.net:27017,hattrickcluster-shard-00-02-zgcgc.mongodb.net:27017/test?ssl=true&replicaSet=HatTrickCluster-shard-0&authSource=admin&retryWrites=true';
        MongoClient.connect(url).then((response) => {
            console.log('Connection to db successful...');
            client = response;
            db = response.db('HatTrickDB');
            collection = response.db('HatTrickDB').collection('PlayerStatsT');
            event.emit('dbconnect');
        }).catch((err) => {
            if(attempts < 4) {
                console.log('Attempting to connect, attempt number ' + attempts + '...');
                attempts++;
                setTimeout(init, delay);
            }
            console.log(err);
        });
    }

};


module.exports.init = function() {
    return new Promise((resolve, reject) => {
        console.log('Connecting to db...');
        const url = 'mongodb://' +  credentials.mongo.username + ':' + credentials.mongo.password + '@hattrickcluster-shard-00-00-zgcgc.mongodb.net:27017,hattrickcluster-shard-00-01-zgcgc.mongodb.net:27017,hattrickcluster-shard-00-02-zgcgc.mongodb.net:27017/test?ssl=true&replicaSet=HatTrickCluster-shard-0&authSource=admin&retryWrites=true';
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

module.exports.getDb = function() {
    return db;
};

module.exports.getCollection = function() {
    return collection;
};

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
