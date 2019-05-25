/**
 * Service worker, will be responsible for
 * frequently updating the database and making calculations
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
let self = this;
const BASE = 0;

module.exports.getAllPlayerInfo = function() {
    console.log('In the promise...');
    return new Promise((resolve, reject) => {
        let request = requestManager.buildRequest('v2.0', 'nba', '', 'players', {});
        let data = requestManager.makeRequest(request);
        if(data) {
            resolve(data);
        } else if(!data) {
            reject('The Promise Request Could Not Be Made');
        } else if(data.playerStatsTotals.length == 0) {
            reject('The Requested Resource Could Not Be Found');
        }
    });
};

/**
 * Get all players
 *
 * Makes a call to the mysportsfeeds api to gather
 * the data specified by the request manager (in
 * this case, all players) and returns a promise
 * with the raw data
 */
module.exports.getAllPlayers = function() {
    console.log('in the promise');
    return new Promise((resolve, reject) => {
        let request = requestManager.buildRequest('v2.0', 'nba', '2018-2019-regular', 'player_stats_totals', {});
        let data = requestManager.makeRequest(request);
        if(data) {
            resolve(data);
        } else if(!data) {
            reject('The Promise Request Could Not Be Made');
        } else if(data.playerStatsTotals.length == 0) {
            reject('The Requested Resource Could Not Be Found');
        }
    });
};

/**
 * Get all team stats
 *
 * Makes a call to the mysportsfeeds api to gather
 * the data specified by the request manager (in
 * this case, all players) and returns a promise
 * with the raw data
 */
module.exports.getAllSeasonalTeamStats = function() {
    return new Promise((resolve, reject) => {
        let request = requestManager.buildRequest('v2.0', 'nba', '2018-2019-regular', 'team_stats_totals', {});
        let data = requestManager.makeRequest(request);
        if(data) {
            resolve(data);
        } else if(!data) {
            reject('The Promise Request Could Not Be Made');
        } else if(data.playerStatsTotals.length == 0) {
            reject('The Requested Resource Could Not Be Found');
        }
    });
};


module.exports.calculateUsageRate = function(playerAt) {
    return new Promise((resolve, reject) => {
        let currentTeam = playerAt.player.currentTeam;
        // if they they're not on a team - they don't
        // have a usage rate
        if(currentTeam != null) {
            dbService.find(db.collection(credentials.mongo.collections.teams), {"team.id":playerAt.player.currentTeam.id}, {}).then((dbResponse) => {
                let team = dbResponse[BASE];
                let teamMinutes = team.stats.miscellaneous.teamMin;
                let teamfieldGoalAttempts = team.stats.fieldGoals.fgAtt;
                let teamFreeThrowAttempts = team.stats.freeThrows.ftAtt;
                let teamTov = team.stats.defense.tov;
                let usageRate = stats.usageRate(playerAt.stats.fieldGoals.fgAtt, playerAt.stats.freeThrows.ftAtt, playerAt.stats.defense.tov, teamMinutes, (Math.ceil(playerAt.stats.miscellaneous.minSeconds / 60)), teamfieldGoalAttempts, teamFreeThrowAttempts, teamTov);
                resolve(usageRate);
            }).catch((err) => {
                reject(err);
            });
        } else {
            let usageRate = 0;
            resolve(usageRate);
        }
    });
};

module.exports.calculateAssistPercentage = function(playerAt) {
  return new Promise((resolve, reject) => {
     let currentTeam = playerAt.player.currentTeam;
     if(currentTeam != null) {
         dbService.find(db.collection(credentials.mongo.collections.teams), {"team.id":playerAt.player.currentTeam.id}, {}).then((dbResponse) => {
             let team = dbResponse[BASE];
             let teamMinutes = team.stats.miscellaneous.teamMin;
             let teamFieldGoals = team.stats.fieldGoals.fgMade;
             let assistPercentage = stats.assistPercentage(playerAt.stats.offense.ast, (Math.ceil(playerAt.stats.miscellaneous.minSeconds / 60)), teamMinutes, teamFieldGoals, playerAt.stats.offense.fgMade);
             resolve(assistPercentage);
         }).catch((err) => {
             reject(err);
         });
     } else {
         let assistPercentage = 0;
         resolve(assistPercentage);
     }
  });
};




module.exports.sortPlayers = function(options, sort) {
    options = {} || options;
    return new Promise(function(resolve, reject) {
        dbService.sort(db.collection(credentials.mongo.collections.players), {}, options, sort).then(function(dbResponse) {
            resolve(dbResponse);
        }).catch(function(err) {
            reject(err);
        });
    });
};


module.exports.addOffRtng = function() {
    self.sortPlayers({},{"stats.offense.ptsPerGame": -1}).then((dbResponse) => {
        for(let i = 0; i < dbResponse.length; i++) {
            dbService.update(db.collection(credentials.mongo.collections.playerStats), {"player.id":dbResponse[i].player.id}, {
                $set: {"stats.advanced.rankingTotal": (i + 1)}}, {multi: false}).then();
        }
    }).catch((err) => {
        console.log(err);
    });
};

module.exports.addDefRtng = function() {
    self.sortPlayers({}, {"stats.defense.stl": -1}).then((dbResponse) => {
        for(let i = 0; i < dbResponse.length; i++) {
            dbService.update(db.collection(credentials.mongo.collections.playerStats), {"player.id":dbResponse[i].player.id}, {
                $set: {"stats.advanced.defRankingTotal": (i + 1)}}, {multi: false}).then();
        }
    }).catch((err) => {
        console.log(err);
    });
};

/**
 * Testing stuff
 */
module.exports.addOffensiveRating = function() {
    return new Promise((resolve, reject) => {
        self.sortPlayers({},{"stats.offense.ptsPerGame": -1}).then((dbResponse) => {
            for(let i = 0; i < dbResponse.length; i++) {
                dbService.update(db.collection(credentials.mongo.collections.playerStats), {"player.id":dbResponse[i].player.id}, {
                    $set: {"stats.advanced.rankingTotal": (i + 1)}}, {multi: false}).then((res) => {
                    resolve(res);
                });
            }
        }).catch((err) => {
            reject();
        });
    });
};

function addDefensiveRating() {
    return new Promise((resolve, reject) => {
        self.sortPlayers({},{"stats.offense.ptsPerGame": -1}).then((dbResponse) => {
            for(let i = 0; i < dbResponse.length; i++) {
                dbService.update(db.collection(credentials.mongo.collections.playerStats), {"player.id":dbResponse[i].player.id}, {
                    $set: {"stats.defense.stl": (i + 1)}}, {multi: false}).then((res) => {
                    resolve(res);
                });
            }
        }).catch((err) => {
            reject();
        });
    });
}

function addUsageRate() {
    return new Promise((resolve, reject) => {

    });
}

/**
 * Insert all players
 *
 * Inserts all players into the database with the specified
 * collection that is provided from db module. Will receive
 * payload, that is, the array of json objects from the
 * payload function and will insert that data into the db
 * via the db service insert method
 */
module.exports.insertAllPlayersTest = function() {
    try {
        this.getAllPlayers().then((data) => {
            // get the payload
            let payload = responseParser.payload(data, "playerStats");
            // connect to db
            let options = {};
            // insert
            dbService.insert(db.collection(credentials.mongo.collections.playerStats), payload, options).then((res) => {
                console.log('Inserted successfully...');
                let promises = Promise.all([
                    addDefensiveRating(),
                    addOffensiveRating()
                ]);
                promises.then(() => {
                    console.log('Added stats successfully...');
                });
            }).catch((err) => {
                throw new Error(err);
            });
        }).catch((data) => {
            console.log(data);
            console.log(new Error(data));
        }).then().then();
    } catch(e) {
        console.log('An error occurred: ' + e);
    }
};



/**
 * Join
 *
 * "Joins" the collections team stats and player
 * stats to form a team roster - that is then inserted
 * into a new collection called team rosters
 */
module.exports.insertTeamRosters = function() {
    dbService.aggregate(db.collection(credentials.mongo.collections.teamStats), {}, {
        $lookup: {
            from: credentials.mongo.collections.playerStats,
            localField: 'team.id',
            foreignField: 'player.currentTeam.id',
            as: "test"
        }
    }, function(data) {
        dbService.insert(db.collection(credentials.mongo.collections.teamRosters), data, {}).then((res) => {
            console.log('Inserted successfully...');
        }).catch((err) => {
            throw new Error(err);
        });
    });
};



/**
 * Get all players
 *
 * Makes a call to the mysportsfeeds api to gather
 * the data specified by the request manager (in
 * this case, all players) and returns a promise
 * with the raw data
 */
module.exports.getAllPlayerProfiles = function() {
    console.log('in the promise');
    return new Promise((resolve, reject) => {
        let request = requestManager.buildRequest('v2.0', 'nba', '', 'players', {});
        let data = requestManager.makeRequest(request);
        if(data) {
            resolve(data);
        } else if(!data) {
            reject('The Promise Request Could Not Be Made');
        } else if(data.playerStatsTotals.length == 0) {
            reject('The Requested Resource Could Not Be Found');
        }
    });
};


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

/**
 * Insert all team stats
 *
 * Inserts all team stats into the database with the specified
 * collection that is provided from db module. Will receive
 * payload, that is, the array of json objects from the
 * payload function and will insert that data into the db
 * via the db service insert method
 */
module.exports.insertTeamProfiles = function() {
    try {
        this.getAllSeasonalTeamStats().then((data) => {
            // get the payload
            let payload = responseParser.payload(data, "teamStats");
            // connect to db
            let options = {};
            // insert
            dbService.insert(db.collection(credentials.mongo.collections.teamStats), payload, options).then((res) => {
                let promises = Promise.all([
                    updateTeamStatsWithImages()
                ]);
                promises.then(() => {
                    console.log('Added additional fields successfully...');
                });
                console.log('Inserted successfully...');
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

/**
 * Insert all players profiles
 *
 * Inserts all player profiles into the database with the specified
 * collection that is provided from db module. Will receive
 * payload, that is, the array of json objects from the
 * payload function and will insert that data into the db
 * via the db service insert method
 */
module.exports.insertAllPlayerProfiles = function() {
    try {
        getAllPlayerProfiles().then((data) => {
        let payload = responseParser.payload(data, "players");
        let options = {};
        // change the collection
        // for this operation
        dbService.insert(db.collection(credentials.mongo.collections.playerProfiles), payload, options).then((res) => {
            console.log('Inserted successfully...');
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


/**
 * Insert all players
 *
 * Inserts all players into the database with the specified
 * collection that is provided from db module. Will receive
 * payload, that is, the array of json objects from the
 * payload function and will insert that data into the db
 * via the db service insert method
 */
module.exports.insertAllPlayers = function() {
    try {
        this.getAllPlayers().then((data) => {
            // get the payload
            let payload = responseParser.payload(data, "playerStats");
            // connect to db
            let options = {};
            // insert
            dbService.insert(db.collection(credentials.mongo.collections.playerStats), payload, options).then((res) => {
                console.log('Inserted successfully...');
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

/**
 * Update player with id
 *
 * Takes an id of a player and will update that
 * player with a new object of type array that is
 * specifies. Calls the db service update function
 * with the included new desired update object
 */
function updatePlayerWithId(id, arr, options) {
    options = {} || options;
    try {
        dbService.update(db.collection(credentials.mongo.collections.playerStats), {"player.id":id}, arr, options).then((result) => {
            console.log('Successfully updated ' + id);
        }).catch((err) => {
            throw new Error(err);
        });
    } catch(e) {
        throw new Error(e);
    }
}

/**
 * Update player
 *
 * Takes a query  and will update that
 * player with a new object of type array that is
 * specifies. Calls the db service update function
 * with the included new desired update object
 */
function updatePlayer(query, arr, options) {
    options = {} || options;
    try {
        dbService.replaceOne(db.collection(credentials.mongo.collections.playerStats), query, arr, options).then((result) => {
            console.log('Successfully replaced ' + result);
        }).catch((err) => {
            throw new Error(err);
        });
    } catch(e) {
        throw new Error(e);
    }
}



/**
 * Update all players
 *
 * Enumerates through the array player ids and
 * compares each player id at j with the player
 * id at i in the payload. If j = i, then that means
 * that the current player id matches the current player,
 * thus in this case causes that player at j to be repalced
 * with the player at i
 */
module.exports.updateAllPlayers = function() {
    console.log('Starting update...');
    try {
      this.getAllPlayers().then(function(data) {
          let pullAll = new Promise((resolve, reject) => {
              dbService.find(db.collection(credentials.mongo.collections.playerStats), {}, {}).then((dbResponse) => {
                  resolve(dbResponse);
              }).catch((err) => {
                  reject(err);
              });
          });
          pullAll.then(function(dbResponse) {
              let payload = responseParser.payload(data, "playerStats");
              for(let j = 0; j < dbResponse.length; j++) {
                  let currentId = dbResponse[j].player.id;
                  for(let i = 0; i < payload.length; i++) {
                      let current = payload[i];
                      if(current.player.id == currentId) {
                          let res = payload.filter(temp => temp.player.id == currentId);
                          if(res.length > 1) {
                              // they played for 2 or more teams
                              // so we need to update all of those
                              for(let k = 0; k < res.length; k++) {
                                  let teamId = res[k].team.id;
                                  let playerId = res[k].player.id;
                                  updatePlayer({$and:[{"player.id":playerId}, {"team.id":teamId}]}, res[k], {});
                              }
                          } else {
                              // they only played for 1 team
                              updatePlayerWithId(currentId, payload[i], {});
                          }
                          // done
                          break;
                      }
                  }
              }
              console.log('Updating completed...');
          }).catch(function(err) {
            console.log(err);
          });

      }).catch(function(err) {
          console.log(err);
      })
  } catch(e) {
      console.log('An error occurred: ' + e);
  }
};



/**
 * Wild card search
 *
 * Will query the db's indices to find
 * the specified string that the
 * user will search for and passes the array
 * of search results into a callback
 */
module.exports.wildcard = function(queryString, options, callback) {
    dbService.wildcardSearch(db.collection(credentials.mongo.collections.playerStats), queryString, options).then(function(data) {
        callback(data);
    })
};



