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
// config.json should contains the Firebase service account keys, read more https://firebase.google.com/docs/server/setup#initialize_the_sdk
firebase.initializeApp({
  serviceAccount: config,
  databaseURL: "https://project-6243802502502885389.firebaseio.com",
});


// Check if token is valid string
function isValidToken(string) {
  if (string.match(/([\w\-\.]+)/g)) {
    console.log('Token is valid')
    return true;
  }
  else {
    return false;
  }
}

// Check Panoptes session
function sessionExists(token) {
  console.log('Getting session');
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
    console.log('Got session', user.login, user.id);
    return user;
  })
  .catch(function(error) {
    console.error('Failed to get session', error);
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
  if (isValidToken(req.query.token)) {
    sessionExists(req.query.token).then(function() {
      const token = firebase.auth().createCustomToken(req.query.uid);
      console.log('Firebase token is', token)
      res.json({ token });
    })
  } else {
    console.log('Invalid token')
  }
});

app.listen(PORT, function () {
  console.log('==> Listening on port ' + PORT);
});
