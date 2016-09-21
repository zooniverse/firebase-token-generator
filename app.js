var express = require('express');
var firebase = require('firebase');
var config = require('./config.json');

var fetch = require('isomorphic-fetch');

// Constants
const PORT = 8080;
const productionUrl = 'https://www.zooniverse.org/api';
const stagingUrl = 'https://panoptes-staging.zooniverse.org/api';
const API_URL = (process.env.NODE_ENV === 'production') ? productionUrl : stagingUrl;

// Initialise the Firebase SDK for Node.js
// config.json should contain the Firebase service account keys, read more https://firebase.google.com/docs/server/setup#initialize_the_sdk
firebase.initializeApp({
  serviceAccount: config,
  databaseURL: "https://project-6243802502502885389.firebaseio.com",
});


// Validate token
function isValidToken(string) {
  if (string.match(/([\w\-\.]+)/g)) {
    console.log('Token is valid')
    return true;
  }
  else {
    return false;
  }
}

// Get current Panoptes user
function getApiUser(token) {
  console.log('Getting user');
  return fetch(API_URL + '/me', {
    method: 'GET',
    mode: 'cors',
    headers: new Headers({
      'Accept': 'application/vnd.api+json; version=1',
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    })
  })
  .then(function(response) {
    return response.json();
  })
  .then(function(json) {
    var user = json.users[0];
    console.log('Got user: ', user.login, user.id);
    return user;
  })
  .catch(function(error) {
    console.error('Failed to get user. Error: ', error);
    throw error;
  });
}


// App
var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/validate', function (req, res, next) {
  var apiToken = req.query.token;
  if (isValidToken(apiToken)) {
    getApiUser(apiToken).then(function() {
      const token = firebase.auth().createCustomToken(req.query.uid);
      res.json({ token });
    })
    .catch(function(err) {
      res.send(403, {error: 'Failed to get API user: ' + err})
    });
  } else {
    res.send(422, {error: 'Invalid token'})
  }
});

app.listen(PORT, function () {
  console.log('==> Listening on port ' + PORT);
});
