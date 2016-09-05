# Firebase Token Generator

A simple Express app that takes a Panoptes token and returns a Firebase token.

---

## Commands

To install, clone the repo and run `npm install`

To run the app locally, run `node app.js`

Any commits to master triggers an automatic deploy to [https://firebase-token-generator.zooniverse.org/](https://firebase-token-generator.zooniverse.org/).

To get a valid Firebase token, hit the `/validate` route and pass a token in the query string, e.g.:

`https://firebase-token-generator.zooniverse.org/validate?token=666`