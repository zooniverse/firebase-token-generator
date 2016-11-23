# Firebase Token Generator

A simple Express app that takes a Panoptes token and returns a Firebase token.

---

## Config

The app requires two configuration files, which both go in the project's root directory.

### Credentials

The Firebase service account credentials go in `./serviceAccountCredentials.json`, and can be downloaded directly from Firebase. More information in [the Firebase docs](https://firebase.google.com/docs/server/setup#initialize_the_sdk).

### Config

We also need a `config.json` file, which stores the Firebase project URL:

```json
{
  "databaseURL": "https://example-project.firebaseio.com"
}
```

---

## Commands

To install, clone the repo and run `npm install`

To run the app locally, run `npm start`

Any commits to master triggers an automatic deploy to [https://firebase-token-generator.zooniverse.org/](https://firebase-token-generator.zooniverse.org/).

To get a valid Firebase token, submit a POST request to the `/validate` route, passing in your Panoptes token as a header.

---

## License

Copyright 2016 Zooniverse

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
