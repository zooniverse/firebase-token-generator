const express = require('express');
const firebase = require('firebase');
const fetch = require('isomorphic-fetch');

// Constants
const PORT = 8080;
const PRODUCTION_URL = 'https://www.zooniverse.org/api';
const STAGING_URL = 'https://panoptes-staging.zooniverse.org/api';
const API_URL = (process.env.NODE_ENV === 'production') ? PRODUCTION_URL : STAGING_URL;

// Initialise the Firebase SDK for Node.js
// Check the README.md file for more information on how the app is configured.
const config = require('./config.json');
firebase.initializeApp(Object.assign({}, config, {
  serviceAccount: './serviceAccountCredentials.json'
}));

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
  var allowedOrigins = /^https?:\/\/(vote|local).zooniverse.org$/;
  var origin = req.headers.origin;
  if (origin.match(allowedOrigins)) {
    res.set('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  next();
});

app.post('/validate', function(req, res, next) {
  const panoptesToken = req.headers.authorization;
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
