let db = require('../db');
let dbService = require('../dbService');
// credentials
let credentials = require('../../credentials');
let requestManager = require('../../middlewares/requestManager');
let fs = require('fs');

// for testing
let mockObj = {
    id: 420,
    name: "Eoin",
    fal: true,
    thingsILike: [
        {
            thing1: "beer",
            when:"always"
        },
        {
            thing2: "scotch",
            when:"everyday"
        },
    ],
    smokesWeed: true
};


// retrieves all players
function getAllPlayers() {
    console.log('in the promise');
    return new Promise((resolve, reject) => {
        let request = requestManager.buildRequest('v2.0', 'nba', '2018-2019-regular', 'player_stats_totals', {});
        let data = requestManager.makeRequest(request);
        if(data) {
            resolve(data);
        } else if(!data) {
            reject({'0': 'The Promise Request Could Not Be Made'})
        } else if(data.playerStatsTotals.length == 0) {
            reject({'1': 'The Requested Resource Could Not Be Found'})
        }
    });
}

module.exports.insertAllPlayers = function() {
    getAllPlayers().then((data) => {
        // connect to db
        let options = {};
        let players = JSON.parse(data).playerStatsTotals;
        for(let i = 0; i < players.length; i++) {
            console.log(players[i]);
            dbService.insert(db.getCollection(), [players[i]], options).then((res) => {

            }).catch((err) => {});
        }
    }).catch((data) => {
        throw new Error(data);
    });
};

// update all of the players
module.exports.updateAllPlayers = function() {
    getAllPlayers().then((data) => {
        let players = JSON.parse(data).playerStatsTotals;
        // get each player by id
        console.log(players[0]);
        for(let i = 0; i < players.length; i++) {
            let currentPlayer = (players[i]).player;
            let currentId = currentPlayer.id;
            // idk if this logic is correct or not, but in either case, all that needs to be
            // done is get each player in the payload by id and
            // update the entry in the db with that corresponding id
            // with the new data
            // btw there are always 806 elements in the collection
            dbService.update(db.getCollection(), {"player.id":currentId}, currentPlayer, {}).then((res) => {
                console.log('Entry updated...');
            }).catch((err) => {
                throw new Error(err);
            });
        }
    });

};

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


