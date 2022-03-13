# Adding response to Tweet

## We need to split code for posting into separate module

Posting goes to `app/post.js`

```js
const googleSearch = require("./google-search");
const dictionary = require("./dictionary");
const axios = require("axios").default;

const {
  GOOGLE_KEY,
  CX,
} = process.env;

module.exports = (twitterBot) => {
  // Randomization
  const keywords = `stock photo ${dictionary.random}`;

  console.log(`🐱 Using keywords: ${keywords}`);

  const randomPage = Math.floor(Math.random() * (100 - 1)) + 1;

  console.log(`🤔 Trying to get stocks from start ${randomPage}`);

  googleSearch
    .searchImages(keywords, GOOGLE_KEY, CX, {
      imgSize: "large",
      start: randomPage,
    })
    .then((data) => {
      const item = googleSearch.getRandom(data.items);
      const { url, itemNo, itemCount } = item;

      console.log(
        `🤡 Trying to download item ${itemNo} from the set of ${itemCount}`
      );

      return axios.get(url, { responseType: "arraybuffer" });
    })
    .then((response) => {
      const buffer = Buffer.from(response.data, "utf-8");

      console.log("Buffering image!");

      return twitterBot.uploadMedia(buffer);
    })
    .then((mediaIds) => {
      console.log("🐦 Tweeting!");
      return twitterBot.tweetWithMedia(keywords, mediaIds);
    })
    .then(() => console.log("👌 Everything went smooth!"))
    .catch((error) => console.error(error));
};

```

## Lets add args

`index.js`

```js
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

// Args
const appArgs = process.argv.slice(2);

switch (appArgs[0]) {
  case "post":
    post(twitterBot);
    break;
  case "respond":
    console.log("respond");
    break;
  default:
    console.error("😥 unknown command, available ones are: post | respond");
}

```
