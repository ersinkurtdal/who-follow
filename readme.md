# Twitter Who Follow App

**This app creates a list of users who do not follow the current user back on Twitter. You can also see a list of users who are following the current user but the user haven't followed them yet.**

Node.js must be installed. [https://nodejs.org/en/](https://nodejs.org/en/)

This app only uses [Twitter for Node.js](https://www.npmjs.com/package/twitter) library. You can install it with this command in terminal.

	npm install

For create a Twitter app please visit. [https://developer.twitter.com/en/apps](https://developer.twitter.com/en/apps)

You can find Consumer API keys and Access token & access token secret keys on **Keys and tokens** tab. These keys must be placed in the config object in app.js.

The **screen_name** in config array must be a Twitter username.

Output files paths are notFriendsOutput and notFollowersOutput in config object.

Runs the app:

	node app.js

This app doesn't control **x-rate-limit-remaining** in response codes at every query. Because in most cases the queries are completed within the boundaries.

If you are getting "message": "Rate limit exceeded" error please check the Twitter Api documentation.
[Twitter Rate Limiting](https://developer.twitter.com/en/docs/basics/rate-limiting.html)

### License ###
The plugin is available under the [MIT license](http://opensource.org/licenses/MIT).