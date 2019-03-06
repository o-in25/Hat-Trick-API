/**
 * Service worker, will be responsible for
 * frequently updating the database and making calculations
 */

let file = require('fs');
let db = require('../db');
let dbService = require('../dbService');
let ObjectId = require('mongodb').ObjectID;
// request manager
let requestManager = require('../../middlewares/requestManager');
let responseParser = require('../../middlewares/responseParser');

// retrieves all players from
// mysportsfeeds
module.exports.getAllPlayers = function() {
    console.log('in the promise');
    return new Promise((resolve, reject) => {
        let request = requestManager.buildRequest('v2.0', 'nba', '2018-2019-regular', 'player_stats_totals', {});
        let data = requestManager.makeRequest(request);
        if(data) {
            resolve(data);
        } else if(!data) {
            reject('The Promise Request Could Not Be Made');
        } else if(data.playerStatsTotals.length == 0) {
            reject('The Requested Resource Could Not Be Found');
        }
    });
};

// timestamps the last time the mysportsfeeds
// payload was updated
function timestamp(data, options) {
    console.log(data.lastUpdatedOn);
    let date = {"LastedUpdated" : data.lastUpdatedOn};
    dbService.insert(db.getCollection(), [date], options).then((result) => {
        console.log('Timestamp added');
    }).catch((err) => {
        console.log(new Error('Failed to add timestamp ' + err));
    });
}

// insert all the players
module.exports.insertAllPlayers = function() {
    this.getAllPlayers().then((data) => {
        // connect to db
        let options = {};
        let payload = JSON.parse(data);
        let players = payload.playerStatsTotals;
        // insert
        timestamp(payload, options);
        for(let i = 0; i < players.length; i++) {
            dbService.insert(db.getCollection(), [players[i]], options).then((res) => {
            }).catch((err) => {});
        }
    }).catch((data) => {
        console.log(data);
        console.log(new Error(data));
    });
};


// updates a player from a given player id
// with the news mysportsfeeds payload response
module.exports.updateAllPlayers = function() {
    this.getAllPlayers().then((data) => {
        console.log((responseParser.createPayloadFromData(data)[0]));
        let payload = JSON.parse(data);
        let options = {};
        let collection = db.getCollection();
        // get all the elements in the collection,
        // since we must get their object ids
        let playerStats = payload.playerStatsTotals;
        timestamp(payload, options);
        dbService.find(collection, {}, options).then((mongoData) => {
            // the mongo data
            for(let i = 0; i < mongoData.length; i++)  {
                if(typeof mongoData[i].id !== "undefined") {
                    let counter = 0;
                    let player = playerStats.find((obj, index) => {
                        // TODO: avoid type coercion
                        if(mongoData[i].id == obj.player.id) {
                            counter = index;
                            return mongoData[i].id == obj.player.id;
                        }
                    });
                    dbService.update(collection, {"_id":ObjectId(mongoData[counter]._id.toString())}, player, options).then((res) => {
                        console.log('Successfully updated...');
                    }).catch((err) => {
                        throw new Error(err);
                    });
                }
            }
        }).catch((err) => {
            throw new Error(err);
        });
    }).catch((err) => {
        throw new Error(err);
    });

};

/**
 * Testing stuff, might delete later
 */
module.exports.updateTest = function() {
  dbService.update(db.getCollection(), {id:420}, {fal:false});
};


module.exports.getAllTeamIds = function() {
        dbService.find(db.getCollection(), {}, {}).then((data) => {
            let str = '';
            let blacklist = [];
            for(let i = 0; i < data.length; i++) {
                let current = data[i];
                try {
                    if(!blacklist.includes(current.team.id.toString())) {
                        str += current.team.id.toString() + '\n';
                    }
                    blacklist.push(current.team.id.toString());

                } catch(err) {
                    if(blacklist.length < 1) {
                        console.log('Field is null or undefined, skipping over...');
                    }
                }
            }

            file.appendFile('./service/service-workers/TeamIDs', str, 'utf8', function(err) {
                if(err) {
                    console.log(err);
                } else {
                    console.log('Successfully wrote...');
                }
            })
        }).catch();
};

module.exports.getAllPlayerIds = function() {
    dbService.find(db.getCollection(), {}, {}).then((data) => {
        let str = '';
        let blacklist = [];
        for(let i = 0; i < data.length; i++) {
            let current = data[i];
            try {
                if(!blacklist.includes(current.player.id.toString())) {
                    str += current.player.id.toString() + '\n';
                }
                blacklist.push(current.player.id.toString());

            } catch(err) {
                if(blacklist.length < 1) {
                    console.log('Field is null or undefined, skipping over...');
                }
            }
        }

        file.appendFile('./service/service-workers/PlayerIDs', str, 'utf8', function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log('Successfully wrote...');
            }
        })
    }).catch();
};

module.exports.insertTest = function() {
    console.log('Inserting...');
    dbService.insert(db.getCollection(), [mockObj], {}).then((res) => {
        console.log('Document inserted...')
    }).catch((err) => {

    });
};


