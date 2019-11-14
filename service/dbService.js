let db = require('./db');
module.exports = {
    insert: function(callback) {
        db.connection.query("insert into test.names values(4, 'johnny', 'sabonis', 'n')").on('result', function(row) {
            callback(null, row);
        }).on('error', function(error) {
           callback(error, undefined);
        });
    }
};