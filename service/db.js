const mysql = require('mysql');
const credentials = require('../credentials');
var connectionInstance;

// a new connection 
// pool
const pool = mysql.createPool({
    host: credentials.mysql.host,
    user: credentials.mysql.user,
    password: credentials.mysql.password,
    database: 'world'
});

exports.connection = {
    query: function () {
        let args = Array.prototype.slice.call(arguments);
        let events = [];
        let eventIndex = {};

        pool.getConnection(function(connectionError, connection) {
            if(connectionError) {
                if(eventIndex.error) {
                    eventIndex.error();
                } else {
                    throw connectionError;
                }
            } else if(!connection) { 
                throw new Error('Error: no connection');
            } else {
                var queryEvent = connection.query.apply(connection, args);
                queryEvent.on('end', function () {
                    console.log('connection relased');
                    connection.release();
                });

                events.forEach(function(args) {
                    queryEvent.on.apply(queryEvent, args);
                });
            }
        });

        return {
            on: function (event, callback) {
                events.push(Array.prototype.slice.call(arguments));
                eventIndex[event] = callback;
                return this;
            }
        };
    }
};
