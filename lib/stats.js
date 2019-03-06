function getParamNames(func) {
    let temp = func.toString().replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg, '');
    let result = temp.slice(temp.indexOf('(') + 1, temp.indexOf(')')).match(/([^\s,]+)/g);
    return (result === null)? [] : result;
}

/*
 * Advanced stats
 */

function trueShootingPercentage(pts, fgAtt, ftAtt) {
     return pts / (2* (fgAtt + 0.44 * ftAtt));
}

function pointsPerPossession(pts, fgAtt, ftAtt, tov) {
    return pts / (fgAtt + 0.44 * ftAtt + tov);
}

function assistPercentage(ast, minSeconds, _teamMinutesPlayed, _teamFieldGoals, fgMade) {
    return 100 * ast / ((( (minSeconds / 60)/(_teamMinutesPlayed/5) * _teamFieldGoals) - fgMade));
}

function turnoverPercentage(tov, fgAtt, ftAtt) {
    return 100 * tov / (fgAtt + 0.44 * ftAtt + tov)
}

function offensiveReboundingPercentage(offReb, _teamMinutesPlayed, minSeconds, _teamOffensiveRebounds, _opponentsDefensiveRebounds) {
    return 100 * (offReb * (_teamMinutesPlayed / 5) / ((minSeconds / 60) * _teamOffensiveRebounds + _opponentsDefensiveRebounds));
}

function effectiveFieldGoalPercentage(fgMade, fg3PtMade, fgAtt) {
    return (fgMade + 0.5 * fg3PtMade) / fgAtt;
}

function usageRate(fgAtt, ftAtt, tov, _teamMinutesPlayed, minSeconds, _teamFieldGoalAttempts, _teamFreeThrowAttempts, _teamTurnovers) {
    return 100 * ((fgAtt + 0.44 * ftAtt + tov) * (_teamMinutesPlayed / 5))/((minSeconds / 60) * (_teamFieldGoalAttempts + 0.44 * _teamFreeThrowAttempts + _teamTurnovers));
}

function offensiveRating(fgMade, ftMade, fgAtt, ftAtt, tov) {
    return 100 * (fgMade + ftMade) / (fgAtt + 0.44 * ftAtt + tov);
}

function offensiveWinShares(fgMade, ftMade, _leaguePointsPerPossession, fgAtt, ftAtt, tov, _leaguePointsPerGame, _teamPace, _leaguePace) {
    return ((fgMade + ftMade) - 0.92 * _leaguePointsPerPossession * (fgAtt + 0.44 * ftAtt + tov))/(0.32 * _leaguePointsPerGame * (_teamPace/_leaguePace));
}

/*
 * Wrapper functions
 */
module.exports.deriveTeamMinutesPlayed = function(callback) {
    callback();
};

module.exports.deriveTeamOffensiveRebounds = function(callback) {
    callback();
};

module.exports.deriveOpponentsOffensiveRebounds = function(callback) {
    callback();
};

module.exports.deriveTeamFieldGoalAttempts = function(callback) {
    callback();
};

module.exports.deriveLeaguePointsPerPossession = function(callback) {
    callback();
};
