function turnoverPercentage(tov, fga, fta, ast) {
    return tov / (fga + 0.475 * fta + ast + tov);
}

function freeThrowRate(ft, fga) {
    return ft / fga;
}

function effectiveFieldGoalPercentage(fg, fga, tpm) {
    return (fg + 0.5 * tpm) / fga;
}

function offensiveReboundingPercentage(orb, tmp, mp, torb, odrb) {
    return 100 * (orb * (tmp / 5) / (mp * (torb + odrb)));
}

// Because this stat does take everything into account,
// it's easily the best measure of shooting ability we have.
// Just for the record, it can also be called adjusted shooting percentage,
// effective shooting percentage, effective percentage, points per
// shot attempted and scoring efficiency.
function trueShootingPercentage(pts, fga, fta) {
    return pts / 2 * (fga + 0.44 * fta)
}

// This may be the most complicated looking calculation yet,
// but the concept behind it is really quite simple. Usage rate calculates what
// percentage of team plays a player was involved in while he was on the floor,
// provided that the play ends in one of the three true results:
// field-goal attempt, free-throw attempt or turnover.
function usageRate(fga, fta, to, tmp, mp, tfga, tfta, tto) {

}

// i am putting this here for now, but
// might ove it somewhere else later on
module.exports.statsBuilder = function(obj) {
    // our new category
    let advanced = {};
    let dictionary = {
        "playerStats":obj.stats,
        "playerFieldGoals":obj.stats.fieldGoals,
        "playerOffense":obj.stats.offense,
        "playerFreeThrows":obj.stats.freeThrows
    };

    advanced['eFgPct'] = effectiveFieldGoalPercentage(dictionary.playerFieldGoals.fg2PtMade, dictionary.playerFieldGoals.fg2PtMade, dictionary.playerFieldGoals.fg3PtMade);
    advanced['tTs'] = trueShootingPercentage(dictionary.playerOffense.pts, dictionary.playerFieldGoals.fg2PtAtt, dictionary.playerFreeThrows.ftAtt);



};
