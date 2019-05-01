/**
 * Insertion worker, will be responsible for
 * frequently inserting player stats, team stats,
 * and league stats
 */

let file = require('fs');
let db = require('../db');
let dbService = require('../dbService');
let references = require('./ref/ref');
let stats = require('../../lib/stats');
// request manager
let requestManager = require('../../middlewares/requestManager');
// response parser
let responseParser = require('../../middlewares/responseParser');
let credentials = require('../../credentials');
let ref = require('./ref/ref');
let serviceWorker = require('./serviceWorker');
/**
 * Testing stuff
 */
function addOffensiveRating() {
    return new Promise((resolve, reject) => {
        serviceWorker.sortPlayers({},{"stats.offense.ptsPerGame": -1}).then((dbResponse) => {
            for(let i = 0; i < dbResponse.length; i++) {
                dbService.update(db.collection(credentials.mongo.collections.playerStats), {"player.id":dbResponse[i].player.id}, {
                    $set: {"stats.rankings.offenseRating": (i + 1)}}, {multi: false}).then((res) => {
                    resolve(res);
                });
            }
        }).catch((err) => {
            reject();
        });
    });
}

function addDefensiveRating() {
    return new Promise((resolve, reject) => {
        serviceWorker.sortPlayers({},{"stats.offense.ptsPerGame": -1}).then((dbResponse) => {
            for(let i = 0; i < dbResponse.length; i++) {
                dbService.update(db.collection(credentials.mongo.collections.playerStats), {"player.id":dbResponse[i].player.id}, {
                    $set: {"stats.rankings.stl": (i + 1)}}, {multi: false}).then((res) => {
                    resolve(res);
                });
            }
        }).catch((err) => {
            reject();
        });
    });
}

function addUsageRate() {
    return new Promise((resolve, reject) => {

    });
}

/**
 * Insert all players
 *
 * Inserts all players into the database with the specified
 * collection that is provided from db module. Will receive
 * payload, that is, the array of json objects from the
 * payload function and will insert that data into the db
 * via the db service insert method
 */
module.exports.insertAllPlayersTest = function() {
    try {
        this.getAllPlayers().then((data) => {
            // get the payload
            let payload = responseParser.payload(data, "playerStats");
            // connect to db
            let options = {};
            // insert
            dbService.insert(db.collection(credentials.mongo.collections.playerStats), payload, options).then((res) => {
                console.log('Inserted successfully...');
                let promises = Promise.all([
                    addDefensiveRating(),
                    addOffensiveRating()
                ]);
                promises.then(() => {
                    console.log('Added stats successfully...');
                });
            }).catch((err) => {
                throw new Error(err);
            });
        }).catch((data) => {
            console.log(data);
            console.log(new Error(data));
        }).then().then();
    } catch(e) {
        console.log('An error occurred: ' + e);
    }
};

