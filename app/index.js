const TwitterBot = require("./twitter-bot");
const post = require("./post");

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
};

// Program start
console.log("🦍 Hello world!");

const twitterBot = new TwitterBot(twitterConfig);

post(twitterBot);
