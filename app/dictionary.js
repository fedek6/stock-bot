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
    "military",
    "grumpy cat"
  ],
  get random() {
    return this.keywords[Math.floor(Math.random() * this.keywords.length)];
  }
}
