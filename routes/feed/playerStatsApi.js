let express = require('express');
let router = express.Router();
// used for the request
let RequestManager = require('../../middlewares/requestManager');

/* gets the entire body response for each request */



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
 * with a given country
 */
router.get('/country/:country', function(req, res, next) {

    function retrieve() {
        console.log('in the promise');
        return new Promise((resolve, reject) => {
            // build the request
            let request = RequestManager.buildRequest('v2.0', 'nba', '2018-2019-regular', 'player_stats_totals', {country: req.params.country});
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
 * with a given team
 */
router.get('/team/:team', function(req, res, next) {

    function retrieve() {
        console.log('in the promise');
        return new Promise((resolve, reject) => {
            // build the request
            let request = RequestManager.buildRequest('v2.0', 'nba', '2018-2019-regular', 'player_stats_totals', {team: req.params.team});
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
 * with a given date
 */
router.get('/date/:date', function(req, res, next) {

    function retrieve() {
        console.log('in the promise');
        return new Promise((resolve, reject) => {
            // build the request
            let request = RequestManager.buildRequest('v2.0', 'nba', '2018-2019-regular', 'player_stats_totals', {date: req.params.date});
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
 * with a given statistic
 */
router.get('/stats/:stats', function(req, res, next) {

    function retrieve() {
        console.log('in the promise');
        return new Promise((resolve, reject) => {
            // build the request
            let request = RequestManager.buildRequest('v2.0', 'nba', '2018-2019-regular', 'player_stats_totals', {stats: req.params.stats});
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
 * with a given name and stat
 */
router.get('/player/:name/stats/:stats', function(req, res, next) {

    function retrieve() {
        console.log('in the promise');
        return new Promise((resolve, reject) => {
            // build the request
            let request = RequestManager.buildRequest('v2.0', 'nba', '2018-2019-regular', 'player_stats_totals', {player: req.params.name, stats: req.params.stats});
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
 * with a given name and date
 */
router.get('/player/:name/date/:date', function(req, res, next) {

    function retrieve() {
        console.log('in the promise');
        return new Promise((resolve, reject) => {
            // build the request
            let request = RequestManager.buildRequest('v2.0', 'nba', '2018-2019-regular', 'player_stats_totals', {player: req.params.name, date: req.params.date});
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
router.get('/position/position:', function(req, res, next) {

    function retrieve() {
        console.log('in the promise');
        return new Promise((resolve, reject) => {
            // build the request
            let request = RequestManager.buildRequest('v2.0', 'nba', '2018-2019-regular', 'player_stats_totals', {position: req.params.position});
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
