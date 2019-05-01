/**
 * A collection of advanced statistics that the
 * app will derive. Any stat this is prefaced
 * with "_" must ve aggregated either from the
 * response payload or from the db - idk which
 * one yet but we will see...
 */

let self = this;

module.exports.trueShootingPercentage = function(pts, fgAtt, ftAtt) {
     return pts / (2* (fgAtt + 0.44 * ftAtt));
};

module.exports.pointsPerPossession = function(pts, fgAtt, ftAtt, tov) {
    return pts / (fgAtt + 0.44 * ftAtt + tov);
};


module.exports.turnoverPercentage = function(tov, fgAtt, ftAtt) {
    return 100 * tov / (fgAtt + 0.44 * ftAtt + tov);
};


module.exports.effectiveFieldGoalPercentage = function(fgMade, fg3PtMade, fgAtt) {
    return (fgMade + 0.5 * fg3PtMade) / fgAtt;
};


module.exports.offensiveRating = function(fgMade, ftMade, fgAtt, ftAtt, tov) {
    return 100 * (fgMade + ftMade) / (fgAtt + 0.44 * ftAtt + tov);
};



/**
 * Requires additional derived stats
 */
module.exports.offensiveWinShares = function(fgMade, ftMade, _leaguePointsPerPossession, fgAtt, ftAtt, tov, _leaguePointsPerGame, _teamPace, _leaguePace) {
    return ((fgMade + ftMade) - 0.92 * _leaguePointsPerPossession * (fgAtt + 0.44 * ftAtt + tov))/(0.32 * _leaguePointsPerGame * (_teamPace/_leaguePace));
};


/**
 * Requires additional derived stats
 */
module.exports.assistPercentage = function(ast, minSeconds, _teamMinutesPlayed, _teamFieldGoals, fgMade) {
    return 100 * ast / ((((minSeconds / 60)/(_teamMinutesPlayed / 5) * _teamFieldGoals) - fgMade));
};

/**
 * Requires additional derived stats
 */
module.exports.usageRate = function(fgAtt, ftAtt, tov, _teamMinutesPlayed, minSeconds, _teamFieldGoalAttempts, _teamFreeThrowAttempts, _teamTurnovers) {
    return 100 * ((fgAtt + 0.44 * ftAtt + tov) * (_teamMinutesPlayed / 5))/((minSeconds / 60) * (_teamFieldGoalAttempts + 0.44 * _teamFreeThrowAttempts + _teamTurnovers));
};

/**
 * Requires additional derived stats
 */
module.exports.offensiveReboundingPercentage = function(offReb, _teamMinutesPlayed, minSeconds, _teamOffensiveRebounds, _opponentsDefensiveRebounds) {
    return 100 * (offReb * (_teamMinutesPlayed / 5) / ((minSeconds / 60) * _teamOffensiveRebounds + _opponentsDefensiveRebounds));
};

module.exports.deriveAdvancedStats = function(playerStatsAt) {

    /**
     * @param {{gamesPlayed:number}} gamesPlayed
     */
    let gamesPlayed = playerStatsAt.gamesPlayed;
    /**
     * @param {{offense:object}} offense
     */
    let offense = playerStatsAt.offense;
    /**
     * @param {{defense:object}} defense
     */
    let defense = playerStatsAt.defense;
    /**
     * @param {{freeThrows:object}} freeThrows
     */
    let freeThrows = playerStatsAt.freeThrows;
    /**
     * @param {{rebounds:object}} rebounds
     */
    let rebounds = playerStatsAt.freeThrows;
    /**
     * @param {{miscellaneous:object}} miscellaneous
     */
    let miscellaneous = playerStatsAt.miscellaneous;
    /**
     * @param {{fieldGoals:object}} miscellaneous
     */
    let fieldGoals = playerStatsAt.fieldGoals;

    return {
        // TODO ADD ALL NEW PLAYER STATS HERE
        "tovPct":Math.ceil(self.turnoverPercentage(Number(defense.tov), Number(fieldGoals.fgAtt), Number(freeThrows.ftAtt))),
        "offRtg":Math.ceil(self.offensiveRating(Number(fieldGoals.fgMade), Number(freeThrows.ftMade), Number(fieldGoals.fgAtt), Number(freeThrows.ftAtt), Number(defense.tov))),
        "efgPct":Math.ceil(self.effectiveFieldGoalPercentage(fieldGoals.fgMade, fieldGoals.fg3PtMade, fieldGoals.fgFgAtt)),
        "tsPct":Math.ceil(self.trueShootingPercentage(offense.pts, fieldGoals.fgAtt, freeThrows.ftAtt)),
        "ptsPerPos":Math.ceil(self.pointsPerPossession(offense.pts, fieldGoals.fgAtt, freeThrows.ftAtt, defense.tov))
    }
};

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

module.exports.deriveUsageRate = function(callback) {

};

module.exports.deriveTeamPace = function(callback) {
    callback();
};

module.exports.deriveOpponentsPace = function(callback) {
    callback();
};

module.exports.deriveOpponentsTeamMinutes = function(callback) {
    callback();
};
