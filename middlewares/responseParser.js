let stats = require('./../lib/stats');
let ratings = require('./../lib/ratings');
let rankings = require('./../lib/rankings');
// takes the raw data from the stream and edits each
// object so we can know how often they have been
// updated

module.exports.parse = function(raw) {
    let playerStats = raw.playerStatsTotals;
    let response = [];
    for(let i = 0; i < playerStats.length; i++) {

        let playerStatsAt = (playerStats[i]).stats;
        let playerPlayerAt = (playerStats[i]).player;
        // TODO & NOTE WELL! derived is passed in as a reference
        addDerivedStats(playerStatsAt, playerPlayerAt);
        // derive player stats here
        response.push({"playerId":(playerStats[i]).player.id, "stats":playerStatsAt});
    }
    return response;
};




module.exports.payload = function(data, statType) {
    let payload = JSON.parse(data);
    // the time stamp
    // this will be appended to each
    // player, so we know exactly
    // what date each player was last updated on
    let lastUpdatedOn = new Date().toDateString();
    if(statType == "playerStats") {
        // the player stats array
        /**
         * @param {{playerStatsTotals:object}} playerStats
         */
        let playerStats = payload.playerStatsTotals;
        let response = [];
        for(let i = 0; i < playerStats.length; i++) {

            let playerStatsAt = (playerStats[i]).stats;
            let playerPlayerAt = (playerStats[i]).player;
            // TODO & NOTE WELL! derived is passed in as a reference
            addDerivedStats(playerStatsAt, playerPlayerAt);
            // derive player stats here
            response.push({"lastUpdatedOn":lastUpdatedOn, "player":(playerStats[i]).player, "team":(playerStats[i]).team, "stats":playerStatsAt});
        }
        // time to clean the response
        //wash(response, payload);

        // create a new player object
        //return cleanedResponse;
        return response;
    } else if(statType == "players") {
        let players = payload.players;
        let response = [];
        for(let i = 0; i < players.length; i++) {
            let playerAt = (players[i]).player;
            let currentTeamAt = (players[i]).teamAsOfDate;
            // derive player stats here
            response.push({"lastUpdatedOn":lastUpdatedOn, "player":playerAt, "teamAsOfDate":currentTeamAt});
        }
        return response;
    } else if(statType == "teamStats") {
        let teamStats = payload.teamStatsTotals;
        let response = [];
        for(let i = 0; i < teamStats.length; i++) {
            let teamAt = (teamStats[i]).team;
            let statsAt = (teamStats[i]).stats;
            response.push({"lastUpdatedOn":lastUpdatedOn, "team":teamAt, "stats":statsAt})
        }
        return response;
    } else if(statType == "rosters") {
        // the player stats array
        /**
         * @param {{playerStatsTotals:object}} playerStats
         */
        let playerStats = payload.playerStatsTotals;
        let response = [];
        for(let i = 0; i < playerStats.length; i++) {

            let playerStatsAt = (playerStats[i]).stats;
            // derive player stats here
            response.push({"player":(playerStats[i]).player, "team":(playerStats[i]).team, "stats":playerStatsAt});
        }
        return response;
    }
};


function addDerivedStats(playerStatsAt, playerPlayerAt) {
    // add a new property to the object which
    // will be called advanced whose type is object
    // ex: advanced: { efG: ...}, etc...
    playerStatsAt['advanced'] = stats.deriveAdvancedStats(playerStatsAt);
    playerStatsAt['ratings'] = ratings.generate(playerStatsAt, playerPlayerAt);
}


module.exports.teamGroup = function(data) {
    let sample = data[0];
    return {
        id:""
    }
};