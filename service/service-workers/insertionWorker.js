/**
 * Insertion worker, will be responsible for
 * frequently inserting player stats, team stats,
 * and league stats
 */

let file = require('fs');
let db = require('../db');
let dbService = require('../dbService');
let references = require('./ref/ref');
let stats = require('../../lib/stats');
// request manager
let requestManager = require('../../middlewares/requestManager');
// response parser
let responseParser = require('../../middlewares/responseParser');
let credentials = require('../../credentials');
let ref = require('./ref/ref');
let serviceWorker = require('./serviceWorker');


/**
 * Testing stuff
 */
function updateTeamMinutes() {
    return new Promise((resolve, reject) => {
        serviceWorker.getAllPlayers().then((data) => {
            let payload = responseParser.payload(data, "rosters");
            let promises = [];
            for(let i = 0; i < ref.teamIds.length; i++) {
                let currentTeam = ref.teamIds[i];
                let minutes = 0;
                for(let j = 0; j < payload.length; j++) {
                    let currentPlayer = payload[j];
                    if(currentPlayer.player.currentTeam != null) {
                        if(currentPlayer.player.currentTeam.id == currentTeam) {
                             minutes += ((currentPlayer.stats.miscellaneous.minSeconds) / 60);
                        }
                    }
                }
                promises.push(dbService.updateMany(db.collection(credentials.mongo.collections.teams), {"team.id": Math.ceil(Number(currentTeam))}, {
                    $set: {
                        "stats.miscellaneous.teamMin": minutes
                    }
                }, {multi: false}));
            }
            Promise.all(promises).then((res) => {
                console.log('Added team minutes...');
                resolve(res);
            }).catch((err) => {
                reject(err);
            })

        }).catch((err) => {
            reject(err);
        })
    });

}

// helper functions to assist
// with player insertion
function updateTeamStatsWithImages() {
    return new Promise((resolve, reject) => {
        let teamIds = ref.teamIds;
        let promises = [];
        for(let i = 0; i < teamIds.length; i++) {
            let current = teamIds[i];
            dbService.find(db.collection(credentials.mongo.collections.teams), {"team.id":Number(current)}, {}).then(function(dbResponse) {
                let currentTeam = dbResponse[0];
                let teamName = currentTeam.team.abbreviation;
                // check for cases
                switch(teamName) {
                    case "BRO":
                        teamName = "BKN";
                        break;
                    case "NOP":
                        teamName = "NO";
                        break;
                    case "UTA":
                        teamName = "UTH";
                        break;
                    case "OKL":
                        teamName = "OKC";
                        break;
                }
                teamName.toLowerCase();
                let url = "https://a.espncdn.com/i/teamlogos/nba/500/" + teamName + ".png";
                promises.push(dbService.updateMany(db.collection(credentials.mongo.collections.teams), {"team.id":Number(current)}, { $set: {"team.teamImg" : url} }, {multi: false}));
            }).catch(function(err) {
                reject(err);
            });
        }
        Promise.all(promises).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        })
    })
}

function addPlayerInfoToPlayerProfiles() {
   return new Promise((resolve, reject) => {
       serviceWorker.getAllPlayerInfo().then((res) => {
           let payload = JSON.parse(res);
           console.log('Adding player info...');
           let players = payload.players;
           let promises = [];
           for(let i = 0; i < players.length; i++) {
               let current = players[i];
               let currentId = current.player.id;
               promises.push(dbService.updateMany(db.collection(credentials.mongo.collections.players), {"player.id":currentId}, {
                   $set: {
                       "player.officialImgSrc":current.player.officialImageSrc,
                       "player.currentContractYear":current.player.currentContractYear,
                       "player.drafted":current.player.drafted,
                   }
               }, {multi: false}));
           }
           resolve(promises);
       }).catch((err) => {
           reject(err);
       });
   });
}


function addPlayerRankings() {
    console.log('Adding rankings...');
    return new Promise((resolve, reject) => {
        serviceWorker.sortPlayers({},{"stats.offense.ptsPerGame": -1}).then((dbResponse) => {
            let promises = [];
            for(let i = 0; i < dbResponse.length; i++) {
                promises.push(dbService.updateMany(db.collection(credentials.mongo.collections.players), {"player.id":dbResponse[i].player.id}, {$set: {"stats.rankings.offRankingTotal": (i + 1)}}, {multi: false}));
            }
            Promise.all(promises).then((res) => {
                serviceWorker.sortPlayers({}, {"stats.defense.stl": -1}).then((dbResponse) => {
                    let promises = [];
                    for(let i = 0; i < dbResponse.length; i++) {
                        promises.push(dbService.updateMany(db.collection(credentials.mongo.collections.players), {"player.id":dbResponse[i].player.id}, {$set: {"stats.rankings.defRankingTotal": (i + 1)}}, {multi: false}));
                    }
                    Promise.all(promises).then((res) => {
                        // any other rankings here
                        console.log('Added rankings...');
                        resolve(res);
                    })
                });
            }).catch((err) => {
                reject(err);
            })

        }).catch((err) => {
            reject(err);
        });
    })
}

function addTeamRosters() {
    return new Promise((resolve, reject) => {
        serviceWorker.getAllPlayers().then((data) => {
            let payload = responseParser.payload(data, "rosters");
            let promises = [];
            for(let i = 0; i < ref.teamIds.length; i++) {
                let currentTeam = ref.teamIds[i];
                let players = [];
                for(let j = 0; j < payload.length; j++) {
                    let currentPlayer = payload[j];
                    if(currentPlayer.player.currentTeam != null) {
                        if(currentPlayer.player.currentTeam.id == currentTeam) {
                            players.push(currentPlayer);
                        }
                    }
                }
                promises.push(dbService.updateMany(db.collection(credentials.mongo.collections.teams), {"team.id": Number(currentTeam)}, {
                    $set: {
                        "roster": players
                    }
                }, {multi: false}));
            }
            Promise.all(promises).then((res) => {
                console.log('Added team rosters...');
                resolve(res);
            }).catch((err) => {
                reject(err);
            })
        });
    })
}



function addAdvancedStatistics() {
    return new Promise((resolve, reject) => {
        dbService.find(db.collection(credentials.mongo.collections.players), {}, {}).then((dbResponse) => {
            for(let i = 0; i < dbResponse.length; i++) {
                let playerAt = dbResponse[i];
                serviceWorker.calculateUsageRate(playerAt).then((usageRate) => {
                   serviceWorker.calculateAssistPercentage(playerAt).then((assistPercentage) => {
                       // add any more advanced stats here
                       dbService.updateMany(db.collection(credentials.mongo.collections.players), {"player.id":playerAt.player.id}, {
                           $set: {
                               "stats.advanced.usageRate":usageRate,
                               "stats.advanced.asstPct":assistPercentage
                           }
                       }, {multi: false}).then((res) => {
                           resolve(res);
                       })
                   })
                }).catch((err) => {
                    reject(err);
                });
            }
        }).catch((err) => {
            reject(err);
        })
    })
}


module.exports.insertTeamProfiles = function() {
    try {
        serviceWorker.getAllSeasonalTeamStats().then((data) => {
            // get the payload
            let payload = responseParser.payload(data, "teamStats");
            // connect to db
            let options = {};
            // insert
            dbService.insert(db.collection(credentials.mongo.collections.teams), payload, options).then((res) => {
                console.log('Inserted successfully...');
                let promises = [];
                promises.push(addTeamRosters());
                promises.push(updateTeamStatsWithImages());
                promises.push(updateTeamMinutes());
                Promise.all(promises).then((res) => {
                    console.log('Added team info...');
                }).catch((err) => {
                    throw err;
                })
            }).catch((err) => {
                throw new Error(err);
            });
        }).catch((data) => {
            console.log(data);
            console.log(new Error(data));
        });
    } catch(e) {
        console.log('An error occurred: ' + e);
    }
};



module.exports.insertPlayerProfiles = function() {
    try {
        serviceWorker.getAllPlayers().then((data) => {
            let payload = responseParser.payload(data, "playerStats");
            let options = {};
            // change the collection
            // for this operation
            dbService.insert(db.collection(credentials.mongo.collections.players), payload, options).then((res) => {
                console.log('Inserted successfully...');
                addPlayerInfoToPlayerProfiles().then((promises) => {
                    Promise.all(promises).then((res) => {
                        console.log('Added player info...');
                        let promises = [];
                        promises.push(addPlayerRankings());
                        promises.push(addAdvancedStatistics());
                        Promise.all(promises).then((res) => {
                            console.log('Done with players...');
                        });
                    }).catch((err) => {
                        throw err;
                    });
                }).catch((err) => {
                    throw err;
                });
                // change the collection back
            }).catch((err) => {
                throw new Error(err);
            });
        }).catch((err) => {
            throw new Error(err);
        });
    } catch (e) {
        console.log('An error occurred: ' + e);
    }
};

