/**
 * Has all of the CRUD methods for accessing the database that
 * we would need, plus a few extra goodies...
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
            options = options || {};
            collection.update(query, update, options);
        }
    });
};



module.exports.updateMany = function(collection, query, update, options) {
    return new Promise((resolve, reject) => {
        if(!collection) {
            reject(new Error('Collection cannot be undefined'));
        } else if(typeof query !== "object") {
            reject(new Error('Query must be of type object'));
        } else {
            options = options || {};
            collection.updateMany(query, update, options).toArray(function(err, res) {
                if(err) {
                    reject(new Error(err));
                } else {
                    resolve(res);
                }
            });
        }
    });
};


module.exports.updateMany = function(collection, query, update, options) {
    return new Promise((resolve, reject) => {
        if(!collection) {
            reject(new Error('Collection cannot be undefined'));
        } else if(typeof query !== "object") {
            reject(new Error('Query must be of type object'));
        } else {
            options = options || {};
            collection.updateMany(query, update, options).toArray(function(err, res) {
                if(err) {
                    reject(new Error(err));
                } else {
                    resolve(res);
                }
            });
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
                   resolve(res);
               }
           });
       }
    });
};


module.exports.wildcardSearch = function(collection, query, options) {
    return new Promise((resolve, reject) => {
        if(!collection) {
            reject(new Error('Collection cannot be undefined'));
        } else {
            collection.find({$text:{$search:query}}, options).toArray(function(err, res) {
                if(err) {
                    reject(new Error(err));
                } else {
                    resolve(res);
                }
            });
        }
    });
};


module.exports.replaceOne = function(collection, query, update, options) {
    return new Promise((resolve, reject) => {
        if(!collection) {
            reject(new Error('Collection cannot be undefined'));
        } else {
            options = options || {};
            collection.replaceOne(query, update, options);
        }
    });
};

module.exports.indexCollection = function(collection) {
    collection.createIndex({"$**":"text"});

};


// this probably does not work
module.exports.aggregate = function(collection, options, aggregation, callback) {
    return collection.aggregate(aggregation, options).toArray(function(err, res) {
        if(err) {
            console.log(err);
        } else {
            callback(res);
        }
    });
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
