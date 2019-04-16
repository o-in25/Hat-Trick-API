let express = require('express');
let router = express.Router();
// used for the request
let RequestManager = require('../../middlewares/requestManager');
// the db
let dbService = require('../../service/dbService');
let db = require('../../service/db');
let ref = require('../../service/service-workers/ref/ref');
/* gets the entire body response for each request */



/*
 * Returns all stats of all
 * players
 */
router.get('/', function(req, res, next) {

});


/*
 * Gets all player stats for team
 * with a given id
 */
router.get('/team/:id', function(req, res, next) {
    dbService.find(db.collection(credentials.mongo.collections.playerStats), {"player.id":Number(req.params.id)}, {}).then((dbResponse) => {
        res.send(dbResponse);
    }).catch((err) => {
        console.log(err);
    });
});




module.exports = router;