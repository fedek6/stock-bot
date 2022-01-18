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
