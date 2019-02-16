let db = require('./db');

/*
Insert
 */
module.exports.insert = function(collection, documents, options) {
    return new Promise((resolve, reject) => {
        if(!collection) {
            reject(new Error('Collection cannot be undefined'));
        } else {
            if(typeof documents !== "object" && !documents.hasOwnProperty('length')) {
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

module.exports.update = function(collection, query, update, options) {
    return new Promise((resolve, reject) => {
        if(!collection) {
            reject(new Error('Collection cannot be undefined'));
        } else {
            collection.update(query, update, options);
        }
    });
};




module.exports.find = function(collection, query, options) {
    return new Promise((resolve, reject) => {
       if(!collection) {
           reject(new Error('Collection cannot be undefined'));
       } else if(typeof query !== "object") {
           reject(new Error('Query must be of type object'));
       } else {
           collection.find(query, options).toArray(function(err, res) {
               if(err) {
                   reject(new Error(err));
               } else {
                   resolve();
               }
           });
       }
    });
};
// this probably does not work
module.exports.aggregate = function(collection, options, aggregation, callback) {
    collection.aggregate(collection, options, callback);
};

module.exports.distinct = function(collection, key, query, options) {
    return new Promise((resolve, reject) => {
        collection.distinct(key, query, options).then((result) => {
            resolve(result);
        }).catch((err) => {
            reject(err);
        });
    });
};
