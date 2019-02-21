module.exports.turnoverPercentage = function(tov, fga, fta, ast) {
    return tov / (fga + 0.475 * fta + ast + tov);
};

module.exports.freeThrowRate = function(ft, fga) {
    return ft / fga;
};


module.exports.effectiveFieldGoalPercentage = function(ft, fga) {
    return ft / fga;
};

module.exports.offensiveReboundingPercentage = function(orb, tmp, mp, torb, odrb) {
    return 100 * (orb * (tmp / 5) / (mp * (torb + odrb)));
};

