const validator = require("validator");

module.exports = class EmailValidator {
  async isValid(email) {
    if (!email) return { error: 400, message: "You must pass an email" };

    let isValid = await validator.isEmail(email);
    return isValid;
  }
};
