const { TwitterApi } = require("twitter-api-v2");
const fs = require("fs");
const path = require("path");

module.exports = class TwitterBot {
  constructor(config) {
    this.client = new TwitterApi(config);
    this.cachePath = config.cachePath;
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
    return this.client.v1.tweet(content, { media_ids: mediaIds });
  }

  /**
   *
   * @param {*} content
   * @param {*} mediaIds
   * @return {Promise}
   */
  replyWithMedia(content, tweetId, mediaIds) {
    return this.client.v1.reply(content, tweetId, { media_ids: mediaIds });
  }

  /**
   *
   * @returns {Promise}
   */
  getMentions() {
    return new Promise((resolve, reject) => {
      const lastResponseFile = path.join(this.cachePath, "last_response.dat");
      const requestOptions = {
        trim_user: true,
        include_entities: false,
      };

      if (fs.existsSync(lastResponseFile)) {
        const lastResponse = fs.readFileSync(lastResponseFile, 'utf8');
        requestOptions.since_id =  Number(lastResponse);
      }

      this.client.v1.mentionTimeline(requestOptions).then(data => {
        resolve(data._realData.reverse() ?? []);
      }).catch(e => reject(e));
    });
  }

  /**
   *
   * @param {*} lastResponseId
   */
  storeLastResponse(lastResponseId) {
    const lastResponseFile = path.join(this.cachePath, "last_response.dat");
    try {
      fs.writeFileSync(lastResponseFile, lastResponseId, { flag: 'w' });
    } catch(err) {
      console.error(err);
    }
  }
};
