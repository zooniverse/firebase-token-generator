var express = require('express');
var firebase = require("firebase");
var api = require("panoptes-client")
var config = require("./config.json")

var app = express();

firebase.initializeApp({
  serviceAccount: config, // config contains sensitive data
  databaseURL: "https://project-6243802502502885389.firebaseio.com",
});


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/validate', function (req, res, next) {
  console.log('P A N O P T E S _ T O K E N: ', req.query.token);
  var customToken = firebase.auth().createCustomToken(req.query.token);
  console.log('F I R E B A S E _ T O K E N: ', customToken);
  res.json({
    token: customToken
  });
});

app.listen(8000, function () {
  console.log('==> Listening on port 8000.');
});