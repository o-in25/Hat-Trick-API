let https = require('https');
let btoa = require('btoa');
let BufferedReader = require('buffer-reader');
let url = require('url');
module.exports = {

    // Goes out to MySportsFeeds and gets whatever
    // request is sent
    // this simple handles the request and knows
    // nothing about how it was made or built
    // ex:
    // { hostname: '...', path: '...',
    // 'headers: {
    // 'Content-Type': 'application/json', 'Authorization': 'Basic ' + btoa('eoin' + ':' + 'Password')
    // }
    makeRequest: function(request) {
        // return a promise
        console.log('HTTP Request Path: ' + request.path);
        return new Promise((resolve, reject) => {
            // the stream will begin as a string
            let str = '';
            https.get(request, (res) => {
                // init the request
                console.log('Building Request...');
                // failed
                res.on('error', (err) => { // error
                    console.log('HTTP Request Failed... ');
                    reject(err);
                });
                // got the url
                // parsing...
                res.on('data', (stream) => { // success
                    let reader = new BufferedReader(stream);
                    // TODO FIND A BETTER WAY TO DO THIS
                    try {
                        while(true) {
                            // since buffer cant read end throw err to break
                            str += reader.nextString(1);
                        }
                    } catch(err) {
                        // end of loop
                    }
                });
                // return the promise
                res.on('end', (end) => { // end
                    console.log('Stream closed...');
                    resolve(str, end);
                })
            })
        });
    },
    buildRequest: function(version, sport, season, statType, requestParameters) {
        // ex: buildRequest('nba', '2017-2018', 'plus-minus', {'team':'cleveland-cavaliers, 'position':'pg'}
        // take a object
        // with 2 arrays containing the
        // request and its value
        const API_KEY = '67282fe9-2bc4-43c1-949a-cb40e4';
        const PASSWORD = 'MYSPORTSFEEDS';
        let res = '';
        let count = 0;
        for(let prop in requestParameters) {
            // will remove the first & on the first param
            if(count == 0) {// if its the first one
                res += requestParameters.hasOwnProperty(prop)?  prop + '=' + requestParameters[prop] : '';
                count++;
            } else {// if its not the first one
                res += requestParameters.hasOwnProperty(prop)?  '&' + prop + '=' + requestParameters[prop] : '';
            }
        }
        return {
            hostname: 'api.mysportsfeeds.com',
            path: '/' + version + '/pull/' + sport + '/' + season + '/' + statType + '.json?' + res,
            method: 'GET',
            // TODO FIND BETTER WAY TO AUTH HEADER
            headers: {
                'Content-Type': 'application/json', "Authorization": 'Basic ' + btoa(API_KEY + ':' + PASSWORD)
            }
        }
    }
};