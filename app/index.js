const googleSearch = require("./google-search");
const { TwitterApi } = require("twitter-api-v2");
const axios = require('axios').default;

const {
  GOOGLE_KEY,
  CX,
  TWITTER_KEY,
  TWITTER_KEY_SECRET,
  TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_TOKEN_SECRET,
} = process.env;

console.log("🦍 Hello world!");

const client = new TwitterApi({
  appKey: TWITTER_KEY,
  appSecret: TWITTER_KEY_SECRET,
  accessToken: TWITTER_ACCESS_TOKEN,
  accessSecret:  TWITTER_ACCESS_TOKEN_SECRET,
});


const keywords = "stock photo hacker";

googleSearch
  .searchImages(keywords, GOOGLE_KEY, CX, {
    imgSize: "large",
    start: Math.floor(Math.random() * (5 - 1)) + 1,
  })
  .then((data) => {
    const item = googleSearch.getRandom(data.items);
    const { url } = item;

    return axios.get(url, { responseType: 'arraybuffer' })
  })
  .then((response) => {
    const buffer = Buffer.from(response.data, "utf-8");

    return client.v1.uploadMedia(buffer, { type: "jpg" });
  })
  .then((mediaIds) => {

    /* const item = googleSearch.getRandom(data.items);
    const { url, title } = item;
    console.log(item); */
    console.log(mediaIds);

    return client.v1.tweet(`${keywords}`,  { media_ids: mediaIds });
  })
  .then((tweet) => console.log(tweet))
  .catch((error) => console.error(error));

