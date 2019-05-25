/**
 * Service worker, will be responsible for
 * frequently updating the database and making calculations
 */

let file = require('fs');
let db = require('../db');
let dbService = require('../dbService');
let credentials = require('../../credentials');


/**************************************************************
 ************************* FILE WRITERS ***********************
 **************************************************************/


/**
 * Get all team ids
 *
 * Writes to a text file a comma delimited list of
 * all team ids. To avoid duplicates, a blacklist is
 * maintained; if the next id is discovered that is
 * already in the blacklist, this means its already found
 * and we can therefore skip it
 */
module.exports.getAllTeamIds = function() {
    dbService.find(db.collection(credentials.mongo.collections.playerStats), {}, {}).then((data) => {
        let blacklist = [];
        let dataField = [];
        for(let i = 0; i < data.length; i++) {
            let current = data[i];
            try {
                // don't write them twice
                if(!blacklist.includes(current.team.id.toString())) {
                    dataField.push("'" + current.team.id.toString() +"'");
                }
                // keep track
                blacklist.push(current.team.id.toString());
            } catch(err) {
                if(blacklist.length < 1) {
                    console.log('Field is null or undefined, skipping over...');
                }
            }
        }
        console.log(dataField);
        file.appendFile('./service/service-workers/ref/TeamIDs.txt', dataField.toString(), 'utf8', function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log('Successfully wrote...');
            }
        })
    }).catch((err) => {
        throw new Error(err);
    });
};

/**
 * Get all player ids
 *
 * Writes to a text file a comma delimited list of
 * all player ids. To avoid duplicates, a blacklist is
 * maintained; if the next id is discovered that is
 * already in the blacklist, this means its already found
 * and we can therefore skip it
 */module.exports.getAllPlayerIds = function() {
    dbService.find(db.collection(credentials.mongo.collections.playerStats), {}, {}).then((data) => {
        let blacklist = [];
        let dataField = [];
        for(let i = 0; i < data.length; i++) {
            let current = data[i];
            try {
                if(!blacklist.includes(current.player.id.toString())) {
                    dataField.push("'" + current.player.id.toString() +"'");
                }
                blacklist.push(current.player.id.toString());
            } catch(err) {
                if(blacklist.length < 1) {
                    console.log('Field is null or undefined, skipping over...');
                }
            }
        }
        console.log(dataField);
        file.appendFile('./service/service-workers/ref/PlayerIDs.txt', dataField.toString(), 'utf8', function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log('Successfully wrote...');
            }
        })
    }).catch((err) => {
        throw new Error(err);
    });
};