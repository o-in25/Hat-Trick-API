let express = require('express');
let router = express.Router();
// used for the request
let RequestManager = require('../../middlewares/requestManager');

/*
 * Gets all player stats for all players
 */
router.get('/', function(req, res, next) {

    function retrieve() {
        console.log('in the promise');
        return new Promise((resolve, reject) => {
            // build the request
            let request = RequestManager.buildRequest('v2.0', 'nba', '2018-2019-regular', 'player_stats_totals', {});
            // make the request
            let data = RequestManager.makeRequest(request);
            if(data) {
                resolve(data);
            } else if(!data) {
                // can't make the request
                reject({'0': 'The Promise Request Could Not Be Made'})
            } else if(data.playerStatsTotals.length == 0) {
                // invalid parameter
                reject({'1': 'The Requested Resource Could Not Be Found'})
            }
        });
    }
    // either resolve the request
    // or reject it
    retrieve().then((data) => {
        // send the payload
        res.send(data);
    }).catch((err) => {
        // send an error
        res.send(err);
    });
});

/*
 * Gets all player stats for player
 * with a given name
 */
router.get('/player/:name', function(req, res, next) {

    function retrieve() {
        console.log('in the promise');
        return new Promise((resolve, reject) => {
            // build the request
            let request = RequestManager.buildRequest('v2.0', 'nba', '2018-2019-regular', 'player_stats_totals', {player: req.params.name});
            // make the request
            let data = RequestManager.makeRequest(request);
            if(data) {
                resolve(data);
            } else if(!data) {
                // can't make the request
                reject({'0': 'The Promise Request Could Not Be Made'})
            } else if(data.playerStatsTotals.length == 0) {
                // invalid parameter
                reject({'1': 'The Requested Resource Could Not Be Found'})
            }
        });
    }
    // either resolve the request
    // or reject it
    retrieve().then((data) => {
        // send the payload
        res.send(data);
    }).catch((err) => {
        // send an error
        res.send(err);
    });
});

/*
 * Gets all player stats for player
 * with a given position
 */
router.get('/player/:country', function(req, res, next) {

    function retrieve() {
        console.log('in the promise');
        return new Promise((resolve, reject) => {
            // build the request
            let request = RequestManager.buildRequest('v2.0', 'nba', '2018-2019-regular', 'player_stats_totals', {player: req.params.country});
            // make the request
            let data = RequestManager.makeRequest(request);
            if(data) {
                resolve(data);
            } else if(!data) {
                // can't make the request
                reject({'0': 'The Promise Request Could Not Be Made'})
            } else if(data.playerStatsTotals.length == 0) {
                // invalid parameter
                reject({'1': 'The Requested Resource Could Not Be Found'})
            }
        });
    }
    // either resolve the request
    // or reject it
    retrieve().then((data) => {
        // send the payload
        res.send(data);
    }).catch((err) => {
        // send an error
        res.send(err);
    });
});



module.exports = router;
