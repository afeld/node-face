var _u = require('underscore'),
  QueryString = require('querystring'),
  Request = require('request');

var FACE_POS_ATTRS = ['center', 'eye_left', 'eye_right', 'mouth_left', 'mouth_center', 'mouth_right', 'nose', 'ear_left', 'ear_right'],
  config = {};

function doGetRequest(path, options){
  options = _u.clone(options);
  
  var asPx = !!options.asPx;
  delete options.asPx;
  
  var url = 'http://api.face.com' + path + '?' + prepareParams(options);
  console.log('Face.com url:', url);
  
  Request({url: url, json: true}, function(err, response, data){
    if (err || data.status !== 'success'){
      if (options.error){
        options.error.apply(options.scope || this, arguments);
      }
    } else {
      if (asPx){
        data = photoDataToPx(data);
      }
      
      options.success.call(options.scope || this, data, response);
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
    } else if (_u.isFunction(val)){
      throw "a function is not a valid parameter: " + option;
    } else if (typeof val === 'object'){
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


// Utility functions

function photoDataToPx(photoData){
  FACE_POS_ATTRS.forEach(function(attr){
    photoData.tags.forEach(function(faceData, i){
      if (photoData.tags[i][attr]){
        photoData.tags[i][attr].x *= ( photoData.width / 100.0 );
        photoData.tags[i][attr].y *= ( photoData.height / 100.0 );
      } else {
        console.warn("WARN: missing position attribute " + attr);
      }
    });
  });
  return photoData;
};
exports.photoDataToPx = photoDataToPx;
