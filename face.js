var _u = require('underscore'),
  QueryString = require('querystring'),
  Request = require('request');

var config = {};

function doGetRequest(path, options){
  options = _u.clone(options);
  
  var success = options.success,
    error = options.error,
    scope = options.scope || this;
  
  delete options.success;
  delete options.error;
  delete options.scope;
  
  _u.defaults(options, config);
  var params = QueryString.stringify(options),
    url = 'http://api.face.com' + path + '?' + params;
  
  console.log('Face.com url:', url);
  Request({url: url, json: true}, function(err, response, data){
    if (err || data.status !== 'success'){
      error.apply(scope, arguments)
    } else {
      success.call(scope, data);
    }
  });
}


exports.init = function(key, secret){
  config.api_key = key;
  config.api_secret = secret;
  
  return exports;
};

exports.facebook = {
  get: function(options){
    options.namespace || (options.namespace = 'facebook.com');
    // convert user_auth param to string
    options.user_auth = 'fb_user:' + options.user_auth.fb_user + ',fb_oauth_token:' + options.user_auth.fb_oauth_token;
    
    doGetRequest('/facebook/get.json', options);
  }
};
