let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');

let logger = require('morgan');
// base necessary endpoints
let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
// db
let db = require('./service/db');
let dbService = require('./service/dbService');
// credentials
let credentials = require('./credentials');
let responseParser = require('./middlewares/responseParser');
let requestManager = require('./middlewares/requestManager');
let serviceWorker = require('./service/service-workers/serviceWorker');


//connect to db
const url = 'mongodb://' +  credentials.mongo.username + ':' + credentials.mongo.password + '@hattrickcluster-shard-00-00-zgcgc.mongodb.net:27017,hattrickcluster-shard-00-01-zgcgc.mongodb.net:27017,hattrickcluster-shard-00-02-zgcgc.mongodb.net:27017/test?ssl=true&replicaSet=HatTrickCluster-shard-0&authSource=admin&retryWrites=true';
db.init(url).then((config) => {
    console.log('Connected to db...');
    /**
     * Put any service workers here...
     */
    //serviceWorker.insertTest();
    //serviceWorker.updateTest();
    serviceWorker.updateAllPlayers();
}).catch((err) => {
    throw new Error(err);
});



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



// base app endpoints
app.use('/', indexRouter);
app.use('/users', usersRouter);

// feed endpoints
app.use('/api/player-stats/', playerStatsApi);
app.use('/api/player-stats/numerical/', playerNumericalStatsApi);

module.exports = app;
