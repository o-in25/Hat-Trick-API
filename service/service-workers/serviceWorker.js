let db = require('../db');
let dbService = require('.../service/dbService');
// credentials
let credentials = require('.../credentials');
let responseParser = require('.../middlewares/responseParser');
let requestManager = require('.../middlewares/requestManager');

module.exports.insertAllPlayers = function() {
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
    retrieve().then((data) => {
        // connect to db
        const url = 'mongodb://' +  credentials.mongo.username + ':' + credentials.mongo.password + '@hattrickcluster-shard-00-00-zgcgc.mongodb.net:27017,hattrickcluster-shard-00-01-zgcgc.mongodb.net:27017,hattrickcluster-shard-00-02-zgcgc.mongodb.net:27017/test?ssl=true&replicaSet=HatTrickCluster-shard-0&authSource=admin&retryWrites=true';
        let options = {};
        let players = JSON.parse(data).playerStatsTotals;
        db.init(url).then((config) => {
            for(let i = 0; i < players.length; i++) {
                console.log(players[i]);
                dbService.insert(config.collection, [players[i]], options).then((res) => {
                }).catch((err) => {})
            }
        });
    }).catch((data) => {
        throw new Error(data);
    });
};