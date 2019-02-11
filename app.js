let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');

let logger = require('morgan');
// base necessary endpoints
let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let db = require('./service/db');
let credentials = require('./credentials');
let responseParser = require('./middlewares/responseParser');
let requestManager = require('./middlewares/requestManager');


// newly added endpoints
let playerStatsApi = require('./routes/feed/playerStatsApi');
let playerNumericalStatsApi = require('./routes/feed/playerNumericalStatsApi');

// create the express object
let app = express();

// needs these dependencies
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//
// connect to db
//db._testInsert();
const url = 'mongodb://' +  credentials.mongo.username + ':' + credentials.mongo.password + '@hattrickcluster-shard-00-00-zgcgc.mongodb.net:27017,hattrickcluster-shard-00-01-zgcgc.mongodb.net:27017,hattrickcluster-shard-00-02-zgcgc.mongodb.net:27017/test?ssl=true&replicaSet=HatTrickCluster-shard-0&authSource=admin&retryWrites=true';

db.init().then((res) => {
    console.log('In the promise');

}).catch((err) => {
    console.log(err);
});

let config = new Promise((resolve, reject) => {
    let request = requestManager.buildRequest('v2.0', 'nba', '2018-2019-regular', 'player_stats_totals', {});
    // make the request
    let data = requestManager.makeRequest(request);
    if(data) {
        resolve(data);
    } else {
        reject();
    }
});



/*
config.then((data) => {
   // console.log(data);

}).catch(() => {
    console.log('oops');
});
 */
//db.connection(url, 'HatTrickDB', 'PlayerStats', data);


/**
 * api endpoints
 */



function* foo() {
    yield 8;
}

// base app endpoints
app.use('/', indexRouter);
app.use('/users', usersRouter);

// feed endpoints
app.use('/api/player-stats/', playerStatsApi);
app.use('/api/player-stats/numerical/', playerNumericalStatsApi);

module.exports = app;
