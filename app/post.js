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
