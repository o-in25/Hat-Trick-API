// a json object that will wrap the request
let Model = require('./model');

module.exports = {

  parseResponse: function(payload, properties) {
      // extract the specified properties from the
      // payload in a neat obj
      let response = {};
      // traverse the model
      let k = 0;
      function process(key, val, prop) {

          console.log('iteration ' + k );
          k++;
          // called for each property
          // in the model
          if(key === properties[key]) {
              // push to response
              //response[key] = val;
              console.log(properties[key]);
              switch(val) {
                  case val === "string":
                      response[prop] = payload[val];
                  case val === "string":
                      response[prop] = payload[val].toString();
                  case val === "boolean":
                      response[prop] = payload[val].toString();
              }
          }
      }

      function traverse(o,func, prop) {
          // for each property
          for (var i in o) {
              // call function and move on
              func.apply(this,[i,o[i], prop]);
              if (o[i] !== null && typeof o[i] == "object") {
                  // go deeper
                  traverse(o[i],func);
              }
          }
      }
      for(let prop in properties) {
        traverse(payload, process, prop);
      }
      console.log(response);
      return response;
  }
};