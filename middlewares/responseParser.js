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
    let cleanedResponse = clean(response, payload);

    // create a new player object
    return cleanedResponse;
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

// another helper
function findCurrentTeamFromReferences(duplicate, playerReferences) {
    for(let j = 0; j < playerReferences.length; j++) {
        if(playerReferences[i] == duplicate) {
            // found the player reference
            return (playerReferences[i]).currentTeam;
        }
    }
}

// probably could be done recursively
function clean(response, payload) {
    // playerReferences = [{id: 10, ... ,}, {id: 420, ... , }]
    let playerReferences = payload.references.playerReferences;
    let duplicates = findDuplicates(response);
    // duplicates = [10, 420, 69, ... , ]
    // for each duplicate
    for(let i = 0; i < duplicates.length; i++) {
        let duplicate = duplicates[i];
        // get what team it is?
        // for example prozingis was on the
        // knicks, but is now on the the mavs
        // so get the mavs id
        let currentTeamId = findCurrentTeamFromReferences(duplicate, playerReferences);

        // proper team found out, time to filter
        let result = response.filter(specification => specification.player.id == duplicate);
        if(result.length != 0) {
            let base = result[0];
            base.currentTeam = currentTeam;
            for(let k = 0; k < result.length; k++) {
                // time to aggregate;
                let currentStats = (result[0]).stats;
                for(let prop in currentStats) {
                    if(typeof prop != "object") {
                        base.stats.gamesPlayed += currentStats.gamesPlayed;
                    } else {
                        for(let subProp in currentStats[prop]) {
                            (base.stats[prop])[subProp] += subProp;
                        }
                    }
                }
            }
        }
    }
}



function addDerivedStats(playerStatsAt) {
    // add a new property to the object which
    // will be called advanced whose type is object
    // ex: advanced: { efG: ...}, etc...
    playerStatsAt['advanced'] = stats.deriveAdvancedStats(playerStatsAt);
}