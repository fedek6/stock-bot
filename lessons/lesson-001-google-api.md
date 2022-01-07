# Lesson 1: Google API

## Update .env file

```env
TWITTER_KEY=""
GOOGLE_KEY=""
CX=""
```

## Add run script

```json
  "scripts": {
    "start": "node -r dotenv/config app/index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

Remove `dotenv` from script. Now it's preloaded!

## Add Google module

Create `app/google-search.js`:

```js
const axios = require('axios').default;

const apiUrl = "https://www.googleapis.com/customsearch/v1";

const defaultParams = {
  start: 1,
  imgSize: "medium",
  searchType: "image",
  filetype: "jpg"
};

module.exports.searchImages =  async (keywords, key, cx, params = {}) => {
  const searchUrl = new URL(apiUrl);
  const searchParams = {...defaultParams, ...params};
  let data;


  searchUrl.searchParams.append("q", keywords);
  searchUrl.searchParams.append("key", key);
  searchUrl.searchParams.append("cx", cx);

  Object.keys(searchParams).forEach(key => {
    searchUrl.searchParams.append(key, searchParams[key]);
  });

  try {
    const resp = await axios.get(searchUrl.toString());
    data = resp.data;
  } catch (err) {
    throw new Error("Something went wrong! 😢: " + err.message)
  }

  return data;
}

module.exports.getRandom = (items) => {
  const random = Math.floor(Math.random() * items.length);
  const item = items[random];

  return {
    url: item.link,
    title: item.title,
    itemNo: random,
    itemCount: items.length
  }
}
```

## Use Google module

```js
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
```