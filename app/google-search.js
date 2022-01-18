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
