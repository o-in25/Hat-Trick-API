/**
 * Service worker, will be responsible for
 * frequently updating the database and making calculations
 */


let db = require('../db');
let dbService = require('../dbService');
let ObjectId = require('mongodb').ObjectID;
// request manager
let requestManager = require('../../middlewares/requestManager');


function* generate() {
    yield 10;
}

// retrieves all players
function getAllPlayers() {
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
}


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
    getAllPlayers().then((data) => {
        // connect to db
        let options = {};
        let payload = JSON.parse(data);
        let players = payload.playerStatsTotals;
        // insert
        timestamp(payload, options);
        for(let i = 0; i < players.length; i++) {
            console.log(players[i]);
            dbService.insert(db.getCollection(), [players[i]], options).then((res) => {
            }).catch((err) => {});
        }

    }).catch((data) => {
        console.log(data);
        console.log(new Error(data));
    });
};



module.exports.updateAll = function() {
    getAllPlayers().then((data) => {
        let payload = JSON.parse(data);
        //console.log(payload.playerStatsTotals[0]);
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


module.exports.insertTest = function() {
    console.log('Inserting...');
    dbService.insert(db.getCollection(), [mockObj], {}).then((res) => {
        console.log('Document inserted...')
    }).catch((err) => {

    });
};

