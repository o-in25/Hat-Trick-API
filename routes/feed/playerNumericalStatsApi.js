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
                resolve(data, req.params.stats);
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
    retrieve().then((data, field) => {
        // send the payload
        let wrapper = [];
        let payload = JSON.parse(data);
        console.log("hi typeof  " + typeof payload.playerStatsTotals[0].team);
        for(let i = 0; i < payload.playerStatsTotals.length; i++) {
            let response = {};
            let playerStat = payload.playerStatsTotals[i];
            let temp = {
                id: playerStat.player.id.toString(),
                firstName: playerStat.player.firstName,
                lastName: playerStat.player.lastName,
                primaryPosition: playerStat.player.primaryPosition,
                team: playerStat.team.team,
                stats: field
            };
            //console.log(temp);
            wrapper.push(temp);
        }
        let response = {};
        response['data'] = wrapper;
        res.send(response);
    }).catch((err) => {
        // send an error
        res.send(err);
    });
});

module.exports = router;
