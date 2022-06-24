const HttpResponseErrors = require("./http-response-errors");
const jwt = require("jsonwebtoken");

module.exports = class TokenGenerator {
  constructor(secret) {
    this.secret = secret;
  }

  async generate(userId) {
    if (!userId) throw new Error("You need pass an userId");
    if (!this.secret) throw new Error("You need pass an secret");

    return jwt.sign({ _id: userId }, this.secret);
  }
}
