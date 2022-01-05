const googleSearch = require("./google-search");
const { GOOGLE_KEY, CX } = process.env;

console.log("🦍 Hello world!");

googleSearch
  .searchImages("stock photo hacker", GOOGLE_KEY, CX, {
    imgSize: "large",
    start: Math.floor(Math.random() * (5 - 1)) + 1
  })
  .then((data) => console.log(googleSearch.getRandom(data.items)))
  .catch((error) => console.error(error));
