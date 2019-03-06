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

