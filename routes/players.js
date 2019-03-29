let express = require('express');
let router = express.Router();

let RequestManager = require('../middlewares/requestManager');

/**
 * Get all the players from
 * the payload
 */
router.get('/', function(req, res, next) {

    function retrieve() {
        console.log('in the promise');
        return new Promise((resolve, reject) => {
            let request = RequestManager.buildRequest('v2.0', 'nba', '2018-2019-regular', 'player_stats_totals', {});
            let data = RequestManager.makeRequest(request);
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
        res.send(data);
    }).catch((data) => {
        res.send(data);
    });
});

module.exports = router;
