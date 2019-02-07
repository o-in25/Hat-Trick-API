let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
// base necessary endpoints
let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let db = require('./service/db');

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


// connect to db
db.establishConnection(function(err) {
    console.log((!err)? 'Connection to DB successful...' : err);
});


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
