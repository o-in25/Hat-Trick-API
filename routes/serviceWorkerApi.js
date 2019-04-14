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



/*
 * Returns all players who match the
 * given string
 */
router.get('/search/:any', function(req, res, next) {
    console.log((req.params.any));
    serviceWorker.wildcard((req.params.any.toString()), {}, function(data) {
        console.log(data);
        res.send(data);
    });
});


module.exports = router;