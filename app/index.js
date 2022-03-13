const TwitterBot = require("./twitter-bot");
const post = require("./post");
const respond = require("./respond");
const path = require('path');

const {
  TWITTER_KEY,
  TWITTER_KEY_SECRET,
  TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_TOKEN_SECRET,
} = process.env;

const twitterConfig = {
  appKey: TWITTER_KEY,
  appSecret: TWITTER_KEY_SECRET,
  accessToken: TWITTER_ACCESS_TOKEN,
  accessSecret: TWITTER_ACCESS_TOKEN_SECRET,
  cachePath: path.resolve(__dirname, "../.cache"),
};

// Program start
console.log("🦍 Hello world!");

const twitterBot = new TwitterBot(twitterConfig);

// Args
const appArgs = process.argv.slice(2);

switch (appArgs[0]) {
  case "post":
    post(twitterBot);
    break;
  case "respond":
    respond(twitterBot);
    break;
  default:
    console.error("😥 unknown command, available ones are: post | respond");
}
