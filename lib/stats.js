let serviceWorker = require('../service/service-workers/serviceWorker');

function turnoverPercentage(tov, fga, fta, ast) {
    return tov / (fga + 0.475 * fta + ast + tov);
}

function freeThrowRate(ft, fga) {
    return ft / fga;
}

function effectiveFieldGoalPercentage(ft, fga) {
    return ft / fga;
}

function offensiveReboundingPercentage(orb, tmp, mp, torb, odrb) {
    return 100 * (orb * (tmp / 5) / (mp * (torb + odrb)));
}


let derivedStats = [
    turnoverPercentage,
    freeThrowRate,
    effectiveFieldGoalPercentage,
    offensiveReboundingPercentage
];

function enumerate(playerStats) {

}


function addStatToPlayer(player) {
    //let tovPct = this.turnoverPercentage(player.defense);
}


// i am putting this here for now, but
// might ove it somewhere else later on
module.exports.statsBuilder = function(playerStatsTotalsObj) {
    

};
