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
