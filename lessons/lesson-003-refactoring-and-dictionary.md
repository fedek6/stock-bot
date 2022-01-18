# Refactoring and dictionary

## Move Twitter code to `app/twitter-bot.js`

This way we can encapsulate all Twitter code in one place.

```js
const { TwitterApi } = require("twitter-api-v2");

module.exports = class TwitterBot {
  constructor(config) {
    this.client = new TwitterApi(config);
  }

  /**
   * Upload media
   *
   * @param {*} buffer Image buffer
   * @returns {Promise} mediaIds
   */
  uploadMedia(buffer) {
    return this.client.v1.uploadMedia(buffer, { type: "jpg" });
  }

  /**
   *
   * @param {*} content
   * @param {*} mediaIds
   * @return {Promise}
   */
  tweetWithMedia(content, mediaIds) {
    return this.client.v1.tweet(content,  { media_ids: mediaIds });
  }
}
```

## Create a dictionary `app/dictionary.js` with a random getter

```js
module.exports = {
  keywords: [
    "angry senior",
    "computer kid",
    "hacker",
    "sad senior",
    "terrorist",
    "electrician",
    "office",
    "cough",
    "sneezing",
    "halloween dog",
    "dog costume",
    "soldier",
    "military"
  ],
  get random() {
    return this.keywords[Math.floor(Math.random() * this.keywords.length)];
  }
}
```

## Refactor main file

```js
const googleSearch = require("./google-search");
const TwitterBot = require("./twitter-bot");
const dictionary = require("./dictionary");
const axios = require("axios").default;

const {
  GOOGLE_KEY,
  CX,
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
```