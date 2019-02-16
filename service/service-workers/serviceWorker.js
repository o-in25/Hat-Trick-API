let db = require('../db');
let dbService = require('../dbService');
// credentials
let credentials = require('../../credentials');
let requestManager = require('../../middlewares/requestManager');


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

function retrieve() {
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
    retrieve().then((data) => {
        // connect to db
        let options = {};
        let players = JSON.parse(data).playerStatsTotals;
        for(let i = 0; i < 1; i++) {
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
    retrieve().then().catch();
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


