const googleSearch = require("./google-search");
const axios = require("axios").default;
const { GOOGLE_KEY, CX } = process.env;

module.exports = (twitterBot) => {
  twitterBot
    .getMentions()
    .then((data) => {
      if (data.length > 0) {
        let { id } = data[data.length - 1];

        console.log("storing id", id + 1000)
        twitterBot.storeLastResponse(String(id + 1000));

        const promises = data.map((row) => {
          let keywords = row.full_text.split(" ");
          keywords.shift();
          keywords = "stock photo " + keywords.join(" ");
          const currentId = row.id_str;

          console.log(`🐱 Using keywords: ${keywords}`);

          const randomPage = Math.floor(Math.random() * (100 - 1)) + 1;
          console.log(`🤔 Trying to get stocks from start ${randomPage}`);

          return googleSearch
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
              console.log(`🐦 Replying to post id ${currentId}`);
              return twitterBot.replyWithMedia(keywords, currentId, mediaIds);
            });
        });

        Promise.all(promises).then((values) => {
          console.log("OK");
        });

      } else {
        console.log("😿 There are no mentions to reply.");
      }
    })
    .catch((e) => console.log(e));
};
