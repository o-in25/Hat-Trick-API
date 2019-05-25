let express = require('express');
let router = express.Router();
// used for the request
let RequestManager = require('../middlewares/requestManager');
// the db
let dbService = require('../service/dbService');
let db = require('../service/db');
// the service worker
let serviceWorker = require('./../service/service-workers/serviceWorker');
/* gets the entire body response for each request */


let model = {"stats.offense.ptsPerGame": -1};
/*
 * Returns all players who match the
 * given string
 */
router.get('/search/:any', function(req, res, next) {
    console.log('Searching...');
    serviceWorker.wildcard((req.params.any.toString()), {}, function(data) {
        res.send(data);
    });
});

router.get('/rank/stats/offense/ptsPerGame', function(req, res, next) {

    serviceWorker.sortPlayers({}, {"stats.offense.ptsPerGame": -1}).then((dbResponse) => {
        res.send(dbResponse);
    }).catch((err) => {
     console.log(err);
    });
});

router.get('/rank/stats/offense/astPerGame', function(req, res, next) {

    serviceWorker.sortPlayers({}, {"stats.offense.astPerGame": -1}).then((dbResponse) => {
        res.send(dbResponse);
    }).catch((err) => {
        console.log(err);
    });
});

router.get('/rank/stats/miscellaneous/plusMinusPerGame', function(req, res, next) {

    serviceWorker.sortPlayers({}, {"stats.miscellaneous.plusMinusPerGame": -1}).then((dbResponse) => {
        res.send(dbResponse);
    }).catch((err) => {
        console.log(err);
    });
});

router.get('/rank/stats/defense/blocksPerGame', function(req, res, next) {

    serviceWorker.sortPlayers({}, {"stats.defense.blkPerGame": -1}).then((dbResponse) => {
        res.send(dbResponse);
    }).catch((err) => {
        console.log(err);
    });
});

module.exports = router;