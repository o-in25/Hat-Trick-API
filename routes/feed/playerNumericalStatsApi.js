let express = require('express');
let router = express.Router();
// used for the request
let RequestManager = require('../../middlewares/requestManager');
let ResponseParser = require('../../middlewares/responseParser');


/* gets the numerical response for each request */

/*
 * Gets the numerical stats for a given position
 */
router.get('/position/:position/stats/:stats', function(req, res, next) {
    function retrieve() {
        console.log('in the promise');
        return new Promise((resolve, reject) => {
            // build the request
            let request = RequestManager.buildRequest('v2.0', 'nba', '2018-2019-regular', 'player_stats_totals', {position: req.params.position, stats: req.params.stats});
            // make the request
            let data = RequestManager.makeRequest(request);
            // TODO MAKE THE ERROR HANDLER BETTER
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
    // or reject it, then handle the
    // payload
    retrieve().then((payload) => {
        let properties = {position: req.params.position, stats: req.params.stats};
        console.log('parsing response');
        ResponseParser.parseResponse(payload, properties);
    }).catch((err) => {
        // send an error
        res.send(err);
    });
});

module.exports = router;
