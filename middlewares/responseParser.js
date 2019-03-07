let stats = require('./../lib/stats');


// takes the raw data from the stream and edits each
// object so we can know how often they have been
// updated
module.exports.payload = function(data) {
    let payload = JSON.parse(data);
    // the time stamp
    // this will be appended to each
    // player, so we know exactly
    // what date each player was last updated on
    let lastUpdatedOn = new Date().toDateString();
    // the player stats array
    /**
     * @param {{playerStatsTotals:object}} playerStats
     */
    let playerStats = payload.playerStatsTotals;
    console.log(playerStats.length);
    let response = [];
    for(let i = 0; i < playerStats.length; i++) {

        let playerStatsAt = (playerStats[i]).stats;
        // TODO & NOTE WELL! derived is passed in as a reference
        addDerivedStats(playerStatsAt);
        // derive player stats here
        response.push({"lastUpdatedOn":lastUpdatedOn, "player":(playerStats[i]).player, "team":(playerStats[i]).team, "stats":playerStatsAt});
    }
    // create a new player object
    return response;
};


function addDerivedStats(playerStatsAt) {
    // add a new property to the object which
    // will be called advanced whose type is object
    // ex: advanced: { efG: ...}, etc...
    playerStatsAt['advanced'] = stats.deriveAdvancedStats(playerStatsAt);
}