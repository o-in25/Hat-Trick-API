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
    dbService.find(db.collection(credentials.mongo.collections.teamStats), {}, {}).then((teams) => {
        for(let i = 0; i < teams.length; i++) {
            let current = teams[i];
            let currentId = current.id;
            dbService.find(db.collection(credentials.mongo.collections.playerStats), {"team.id":currentId}, {}).then((players) => {
                let minutes = 0;
                for(let j = 0; j < teams.length; j++) {
                    let current = players[i];
                    minutes += (current.stats.miscellaneous.minSeconds / 60);
                }
                dbService.updateMany(db.collection(credentials.mongo.collections.teamStats), {"team.id":currentId}, {
                    $set: {
                        "stats.miscellaneous.teamMinutes": minutes
                    }
                }, {}).then((res) => {
                    console.log('Updated team minutes...');
                    resolve(res);
                }).catch((err) => {
                    throw (err);
                });
            }).catch((err) => {
                throw (err);
            });
        }
    }).catch((err) => {
        throw (err);
    });
}

// helper functions to assist
// with player insertion
function updateTeamStatsWithImages() {
    let teamIds = ref.teamIds;
    for(let i = 0; i < teamIds.length; i++) {
        let current = teamIds[i];
        dbService.find(db.collection(credentials.mongo.collections.teamRosters), {"team.id":Number(current)}, {}).then(function(dbResponse) {
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
            dbService.update(db.collection(credentials.mongo.collections.teamRosters), {"team.id":Number(current)}, { $set: {"team.officalLogoImageSrc" : url} }, {}).then(function(res) {
                console.log('Successfully updated')
            }).catch(function(err) {
                throw err;
            });
        }).catch(function(err) {
            throw new Error(err);
        });
    }
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
                    if(currentPlayer.team.id == currentTeam) {
                        players.push(currentPlayer);
                    }
                }
                dbService.updateMany(db.collection(credentials.mongo.collections.teams), {"team.id": Number(currentTeam)}, {
                    $set: {
                        "roster": players
                    }
                }, {multi: false});
                promises.push();
            }
            Promise.all(promises).then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            })
        });
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
                addTeamRosters().then((res) => {
                    console.log('Added team rosters...');
                });
                console.log('Added additional fields successfully...');
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
                        addPlayerRankings().then((res) => {
                            console.log('Done with players...');
                            // anything else
                            // will go here
                        }).catch((err) => {
                            throw err;
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

