var express = require('express');
var firebase = require("firebase");
var api = require("panoptes-client")
var config = require("./config.json")


// Constants
const PORT = 8080;


// Initialise the Firebase SDK for Node.js
// config.json should contains the Firebase service account keys, read more https://firebase.google.com/docs/server/setup#initialize_the_sdk
firebase.initializeApp({
  serviceAccount: config,
  databaseURL: "https://project-6243802502502885389.firebaseio.com",
});


// App
var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/validate', function (req, res, next) {
  const token = firebase.auth().createCustomToken(req.query.token);
  res.json({ token });
});

app.listen(PORT, function () {
  console.log('==> Listening on port ' + PORT);
});