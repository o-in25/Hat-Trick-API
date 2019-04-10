function threePointRating(fg3PtPct) {
    return 1.485 * (fg3PtPct) + 25;
}

function midRangeRating(fgPct) {
    return 1.320 * (fgPct) + 25;
}

function closeRangeRating(fgPct) {
    return 1.424 * (fgPct) + 25;
}

function threePointContested(height, threePointRating) {
    let base = height.replace(/["']/g, "");
    let feet = Number(base.substring(0, 1));
    let inches = Number(base.substring(1));
    if(feet >= 6 && inches >= 8) {
        return 0.477 * threePointRating + 25;
    } else {
        return 0.539 * threePointRating + 25;
    }
}

function midRangeContested(height, midRangeRating) {
    let base = height.replace(/["']/g, "");
    let feet = Number(base.substring(0, 1));
    let inches = Number(base.substring(1));
    if(feet >= 6 && inches >= 8) {
        return 0.477 * midRangeRating + 25;
    } else {
        return 0.539 * midRangeRating + 25;
    }
}

function freeThrowRating(ftPct) {
    return ftPct * 100;
}

function postControlRating(weight, height) {
    if(height != null || weight != null) {
        let base = height.replace(/["']/g, "");
        let feet = Number(base.substring(0, 1));
        let inches = Number(base.substring(1));
        let newHeight = (feet * 12) + inches;
        return 0.00205 * (newHeight * weight) + 50;
    } else {
        return 0.00205 * (75) + 25;
    }
}

function postFadeAwayRating(midRangeRating, closeRating) {
    return ((midRangeRating + closeRating) / 2) - 15;
}

function ballControlRating(height, astPerGame, tovPerGame) {
    if(height != null && astPerGame != null && tovPerGame != null) {
        let base = height.replace(/["']/g, "");
        let feet = Number(base.substring(0, 1));
        let inches = Number(base.substring(1));
        if(feet >= 6 && inches >= 8) {
            return 8.106 * (astPerGame / tovPerGame) + 60;
        } else {
            return 16.212 * (astPerGame / tovPerGame) + 25;
        }
    } else {
        return ((16.212 + 25) + (8.106 + 60) / 2) ;

    }

}

function offDribbleMidRangeRating(ballControlRating, midRangeRating, height) {
    let temp = ((midRangeRating + threePointRating) / 2);
    let base = height.replace(/["']/g, "");
    let feet = Number(base.substring(0, 1));
    let inches = Number(base.substring(1));
    if(feet >= 6 && inches >= 8) {
        return (temp - 10);
    } else {
        return (temp + 10);
    }
}

function offDribbleeThreePontRating(ballControlRating, threePointRating, height) {
    let temp = ((ballControlRating + threePointRating) / 2);
    let base = height.replace(/["']/g, "");
    let feet = Number(base.substring(0, 1));
    let inches = Number(base.substring(1));
    if(feet >= 6 && inches >= 8) {
        return (temp - 10);
    } else {
        return (temp + 10);
    }
}

function blockRating(gamesPlayed, blkPerGame) {
    return ((blkPerGame / gamesPlayed) * 1000) + 70;
}

function generateRatings(fg3PtPct, fgPct, weight, height, gamesPlayed, blkPerGame, astPerGame, tovPerGame) {
    let fg3PtRtng = Math.ceil(threePointRating(fg3PtPct));
    let mdRngRtng = Math.ceil(midRangeRating(fgPct));
    let clRngRtng =  Math.ceil(closeRangeRating(fgPct));
    let postCntlRtng = Math.ceil(postControlRating(weight, height));
    let blkRating = Math.ceil(blockRating(gamesPlayed, blkPerGame));
    let ballCntlRtng = Math.ceil(ballControlRating(height, astPerGame, tovPerGame));
    // final rating
    let ovrRtng = Math.ceil((fg3PtRtng + mdRngRtng + clRngRtng + postCntlRtng + blkRating + ballCntlRtng) / 6);
    return {
        'fg3PtRtng':fg3PtRtng,
        'mdRngRtng':mdRngRtng,
        'clRngRtng':clRngRtng,
        'ovrRtng':ovrRtng,
        'postCntrlRting': postCntlRtng,
        'blkRtng': blkRating
    }
}

module.exports.generate = function(playerStatsAt, playerPlayerAt) {
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
    return generateRatings(fieldGoals.fg3PtPct, fieldGoals.fgPct, playerPlayerAt.weight, playerPlayerAt.height, gamesPlayed, defense.blkPerGame, offense.astPerGame, defense.tovPerGame);
};

