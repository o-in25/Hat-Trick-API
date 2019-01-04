// a json object that will wrap the request
let Model = require('./model');

module.exports = {
  parse: function(payload) {

      function traverse(o,func) {
          for (var i in o) {
              func.apply(this,[i,o[i]]);
              if (o[i] !== null && typeof(o[i])=="object") {
                  traverse(o[i],func);
              }
          }
      }
      traverse(payload, (key, val) => {
          // called for each property
          // in the model
      })
  }
};