var _u = require('underscore'),
  QueryString = require('querystring'),
  Request = require('request');

var config = {};

function doGetRequest(path, options){
  var success = options.success,
    error = options.error,
    scope = options.scope || this,
    url = 'http://api.face.com' + path + '?' + prepareParams(options);
  
  console.log('Face.com url:', url);
  Request({url: url, json: true}, function(err, response, data){
    if (err || data.status !== 'success'){
      if (error){
        error.apply(scope, arguments);
      }
    } else {
      success.call(scope, data);
    }
  });
}

// returns a query string in the Face.com standard format:
// nested params become comma-separated lists
function prepareParams(options){
  options = _u.clone(options);
  
  delete options.success;
  delete options.error;
  delete options.scope;
  
  for (var option in options){
    var val = options[option];
    if (_u.isArray(val)){
      options[option] = val.join(',');
    } else if (typeof val === 'object' && !_u.isFunction(val)){
      options[option] = _u.reduce(val, function(memo, val, key){
        return memo.concat(key + ':' + val);
      }, []).join(',');
    }
  }
  
  _u.defaults(options, config);
  return QueryString.stringify(options)
}


exports.init = function(key, secret){
  config.api_key = key;
  config.api_secret = secret;
  
  return exports;
};

exports.facebook = {
  get: function(options){
    options.namespace || (options.namespace = 'facebook.com');
    doGetRequest('/facebook/get.json', options);
  }
};
