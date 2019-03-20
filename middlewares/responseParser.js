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
    let blacklist = [];
    for(let i = 0; i < playerStats.length; i++) {

        let playerStatsAt = (playerStats[i]).stats;
        // TODO & NOTE WELL! derived is passed in as a reference
        addDerivedStats(playerStatsAt);
        // derive player stats here
        response.push({"lastUpdatedOn":lastUpdatedOn, "player":(playerStats[i]).player, "team":(playerStats[i]).team, "stats":playerStatsAt});
    }
    // time to clean the response


    // create a new player object
    return response;
};

// a helper
function findDuplicates(response) {
    let duplicates = [];
    let duplicateCount = 0;
    for(let i = 0; i < response.length; ++i) {
        let current = response[i].player.id;
        if(duplicates.includes(current)) {
            duplicateCount++;
            console.log(current);
        }
        duplicates.push(current);
    }
    return duplicates;
}

// this is not efficient at all, but at this
// point, i don't really give a fuck
function clean(response, payload) {
    let duplicates = findDuplicates(response);
    let playerReferences = payload.references.playerReferences;
    // found the duplicates, time to get
    // to work
    // for each duplicate
    for(let i = 0; i < duplicates.length; i++) {
        let duplicate = duplicates[i];
        // what team is the right one?
        // we have duplicate player stats, with
        // conflicting teams - which one is the right one?
        // well, we will find out, muthafucka
        let teamId;
        for(let j = 0; j < playerReferences.length; j++) {
            let current = playerReferences[i];
            if(current.id == duplicate) {
                // found the player reference
                teamId = current.currentTeam.id;
            }
        }
        // proper team found out, time to filter
        let result = response.filter(specification => specification.player.id == duplicate);
        for(let k = 0; k < result.length; k++) {

        }


    }


    while(i < index) {
        let duplicate = duplicates[i];
        let result = response.filter(specification => specification.player.id == duplicate);
        // for each element in the found set of duplicates
        for(let i = 0; i < result.length; i++) {
            // get the current team by how many games they played

        }

    }

    console.log(duplicates);
}



function addDerivedStats(playerStatsAt) {
    // add a new property to the object which
    // will be called advanced whose type is object
    // ex: advanced: { efG: ...}, etc...
    playerStatsAt['advanced'] = stats.deriveAdvancedStats(playerStatsAt);
}