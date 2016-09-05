# Firebase Token Generator

A simple Express app that takes a Panoptes token and returns a Firebase token.

---

## Commands

To install, clone the repo and run `npm install`

To run the app locally, run `node app.js`

Any commits to master triggers an automatic deploy to [https://firebase-token-generator.zooniverse.org/](https://firebase-token-generator.zooniverse.org/).

To get a valid Firebase token, hit the `/validate` route and pass a token in the query string, e.g.:

`https://firebase-token-generator.zooniverse.org/validate?token=<yourPanoptesToken>`

---

##License

Copyright 2016 Zooniverse

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.