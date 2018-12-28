let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

// base necessary endpoints
let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');

// newly added endpoints
let playerStatsApi = require('./routes/feed/playerStatsApi');

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

module.exports = app;
