let express = require('express');
let router = express.Router();
// used for the request
let RequestManager = require('../../middlewares/requestManager');
// the db
let dbService = require('../../service/dbService');
let db = require('../../service/db');
/* gets the entire body response for each request */



/*
 * Returns all stats of all
 * players
 */
router.get('/', function(req, res, next) {
    dbService.find(db.getCollection(), {}, {}).then((dbResponse) => {
        res.send(dbResponse);
    }).catch((err) => {
        console.log(err);
    });
});


/*
 * Gets all player stats for player
 * with a given id
 */
router.get('/player/:id', function(req, res, next) {
    dbService.find(db.getCollection(), {"player.id":Number(req.params.id)}, {}).then((dbResponse) => {
        res.send(dbResponse);
    }).catch((err) => {
        console.log(err);
    });
});

/*
 * Gets all player stats for player
 * for a given points per game
 */
router.get('/player/points/:ptsPerGame', function(req, res, next) {
    /**
     * @param {{ptsPerGame:object}} ptsPerGame
     */
    dbService.find(db.getCollection(), {"stats.offense.ptsPerGame":Number(req.params.ptsPerGame)}, {}).then((dbResponse) => {
        res.send(dbResponse);
    }).catch((err) => {
        console.log(err);
    });
});

/*
 * Gets all player stats for player
 * for a given points per game >= n
 */
router.get('/player/points/gte/:ptsPerGame', function(req, res, next) {
    /**
     * @param {{ptsPerGame:object}} ptsPerGame
     */
    dbService.find(db.getCollection(), {"stats.offense.ptsPerGame":{$gte:Number(req.params.ptsPerGame)}}, {}).then((dbResponse) => {
        res.send(dbResponse);
    }).catch((err) => {
        console.log(err);
    });
});



module.exports = router;