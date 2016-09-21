const express = require('express');
const firebase = require('firebase');
const fetch = require('isomorphic-fetch');
const config = require('./config.json');

// Constants
const PORT = 8080;
const PRODUCTION_URL = 'https://www.zooniverse.org/api';
const STAGING_URL = 'https://panoptes-staging.zooniverse.org/api';
const API_URL = (process.env.NODE_ENV === 'production') ? PRODUCTION_URL : STAGING_URL;

// Initialise the Firebase SDK for Node.js
// config.json should contain the Firebase service account keys
// read more https://firebase.google.com/docs/server/setup#initialize_the_sdk
firebase.initializeApp({
  serviceAccount: config,
  databaseURL: 'https://project-6243802502502885389.firebaseio.com',
});

// Validate token
function isValidToken(panoptesToken) {
  if (panoptesToken.match(/([\w\-\.]+)/g)) {
    console.log('Token is valid');
    return true;
  }
  return false;
}

// Get current Panoptes user
function getPanoptesUser(panoptesToken) {
  console.log('Getting user');
  return fetch(API_URL + '/me', {
    method: 'GET',
    mode: 'cors',
    headers: new Headers({
      'Accept': 'application/vnd.api+json; version=1',
      'Authorization': 'Bearer ' + panoptesToken,
      'Content-Type': 'application/json'
    })
  })
  .then(response => response.json())
  .then(json => {
    const user = json.users[0];
    console.log('Got user: ', user.login, user.id);
    return user;
  })
  .catch(error => {
    console.error('Failed to get user. Error: ', error);
    throw error;
  });
}


// App
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/validate', function(req, res, next) {
  const panoptesToken = req.query.token;
  if (isValidToken(panoptesToken)) {
    getPanoptesUser(panoptesToken)
      .then(user => {
        const firebaseToken = firebase.auth().createCustomToken(user.login);
        res.json({ token: firebaseToken });
      })
      .catch(error => res.status(403).send({
        error: 'Failed to get API user: ' + error
      }));
  } else {
    res.status(422).send({ error: 'Invalid token' });
  }
});

app.listen(PORT, () => console.log('==> Listening on port ' + PORT));
