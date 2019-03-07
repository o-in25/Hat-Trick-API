/**
 * Service worker, will be responsible for
 * frequently updating the database and making calculations
 */

let file = require('fs');
let db = require('../db');
let dbService = require('../dbService');
let references = require('./ref/ref');
let ObjectId = require('mongodb').ObjectID;
let _ = require('lodash');
// request manager
let requestManager = require('../../middlewares/requestManager');
let responseParser = require('../../middlewares/responseParser');


/**
 * Get all players
 *
 * Makes a call to the mysportsfeeds api to gather
 * the data specified by the request manager (in
 * this case, all players) and returns a promise
 * with the raw data
 */
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


/**
 * Insert all players
 *
 * Inserts all players into the database with the specified
 * collection that is provided from db module. Will receive
 * payload, that is, the array of json objects from the
 * payload function and will insert that data into the db
 * via the db service insert method
 */
module.exports.insertAllPlayers = function() {
    try {
        this.getAllPlayers().then((data) => {
            // get the payload
            let payload = responseParser.payload(data);
            // connect to db
            let options = {};
            // insert
            console.log(payload.length);
            dbService.insert(db.getCollection(), payload, options).then((res) => {
                console.log('Inserted successfully...');
            }).catch((err) => {
                throw new Error(err);
            });
        }).catch((data) => {
            console.log(data);
            console.log(new Error(data));
        });
    } catch(e) {
        console.log('An error occurred: ' + e);
    }
};

/**
 * Update player with id
 *
 * Takes an id of a player and will update that
 * player with a new object of type array that is
 * specifies. Calls the db service update function
 * with the included new desired update object
 */
function updatePlayerWithId(id, arr, options) {
    options = {} || options;
    try {
        dbService.update(db.getCollection(), {"player.id":id}, arr, options).then((result) => {
            console.log('Successfully updated ' + id);
        }).catch((err) => {
            throw new Error(err);
        });
    } catch(e) {
        console.log('An error occurred: ' + e);
    }
}
// export the module
module.exports.updatePlayerWithId = updatePlayerWithId;


/**
 * Update all players
 *
 * Enumerates through the array player ids and
 * compares each player id at j with the player
 * id at i in the payload. If j = i, then that means
 * that the current player id matches the current player,
 * thus in this case causes that player at j to be repalced
 * with the player at i
 */
module.exports.updateAllPlayers = function() {
    console.log('Starting update...');
    try {
      this.getAllPlayers().then(function(data) {
          let payload = responseParser.payload(data);
          let playerIds = references.playerIds;
          for(let j = 0; j < playerIds.length; j++) {
              let currentId = Number(playerIds[j]);
              for(let i = 0; i < payload.length; i++) {
                  let current = payload[i];
                  if(current.player.id == currentId) {
                      // match
                      updatePlayerWithId(currentId, payload[i], {});
                      // done
                      break;
                  }
              }
          }
          console.log('Updating completed...');
      }).catch(function(err) {
          console.log(err);
      })
  } catch(e) {
      console.log('An error occurred: ' + e);
  }
};









/**
 * Testing stuff, might delete later
 */
module.exports.updateTest = function() {
  dbService.update(db.getCollection(), {id:420}, {fal:false});
};

// writes all team ids to a file
module.exports.getAllTeamIds = function() {
        dbService.find(db.getCollection(), {}, {}).then((data) => {
            let blacklist = [];
            let dataField = [];
            for(let i = 0; i < data.length; i++) {
                let current = data[i];
                try {
                    // don't write them twice
                    if(!blacklist.includes(current.team.id.toString())) {
                        dataField.push("'" + current.team.id.toString() +"'");
                    }
                    // keep track
                    blacklist.push(current.team.id.toString());
                } catch(err) {
                    if(blacklist.length < 1) {
                        console.log('Field is null or undefined, skipping over...');
                    }
                }
            }
            console.log(dataField);
            file.appendFile('./service/service-workers/ref/TeamIDs.txt', dataField.toString(), 'utf8', function(err) {
                if(err) {
                    console.log(err);
                } else {
                    console.log('Successfully wrote...');
                }
            })
        }).catch((err) => {
            throw new Error(err);
        });
};

// writes all player ids to a file
module.exports.getAllPlayerIds = function() {
    dbService.find(db.getCollection(), {}, {}).then((data) => {
        let blacklist = [];
        let dataField = [];
        for(let i = 0; i < data.length; i++) {
            let current = data[i];
            try {
                if(!blacklist.includes(current.player.id.toString())) {
                    dataField.push("'" + current.player.id.toString() +"'");
                }
                blacklist.push(current.player.id.toString());
            } catch(err) {
                if(blacklist.length < 1) {
                    console.log('Field is null or undefined, skipping over...');
                }
            }
        }
        console.log(dataField);
        file.appendFile('./service/service-workers/ref/PlayerIDs.txt', dataField.toString(), 'utf8', function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log('Successfully wrote...');
            }
        })
    }).catch((err) => {
        throw new Error(err);
    });
};




module.exports.insertTest = function() {
    console.log('Inserting...');
    dbService.insert(db.getCollection(), [mockObj], {}).then((res) => {
        console.log('Document inserted...')
    }).catch((err) => {

    });
};


