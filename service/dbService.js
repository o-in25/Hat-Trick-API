let db = require('./db.js');


/*
Insert
 */
module.exports.insert = function(collection, documents, options) {
    return new Promise((resolve, reject) => {
        if(!collection) {
            reject(new Error('Collection cannot be undefined'));
        } else {
            if(typeof documents != "object" && !documents.hasOwnProperty('length')) {
                reject(new Error('Document must be of type array'));
            } else {
                collection.insertMany(documents, options).then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
            }
        }
    })
};

