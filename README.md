# node-face

A Face.com API wrapper for NodeJS.  Created by [Aidan Feldman](http://www.aidanfeldman.com).

## Setup

1. Install via npm:

```bash
$ npm install node-face
```

2. Require in your node project:

```javascript
// app.js
var face = require('node-face');

face.init(FACE_API_KEY, FACE_API_SECRET);
```

It's usually best to set your API key and secret as environment variables - something like

```bash
# ~/.bash_profile
export MYAPP_FACE_API_KEY=<insert key here>
export MYAPP_FACE_API_SECRET=<insert secret here>
```
```javascript
// app.js
face.init(process.env.MYAPP_FACE_API_KEY, process.env.MYAPP_FACE_API_SECRET);
```

Just don't forget to run `$ source ~/.bash_profile` after you modify your `.bash_config`.

## Usage

### [facebook.get](http://developers.face.com/docs/api/facebook-get/)

"Returns facebook tags for one or more specified User IDs."

```javascript
face.facebook.get({
  uids: '2232645,571756321', // integer, array or string of IDs
  user_auth: { // object or string
    fb_user: 2232645,
    fb_oauth_token: ...
  },
  success: function(data){ ... },
  error: function(error, response, data){ ... }, // optional
  scope: this // optional
});
```
