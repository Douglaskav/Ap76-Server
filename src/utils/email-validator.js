const validator = require("validator");

module.exports = class EmailValidator {
  isValid(email) {
    if (!email) return { error: 400, message: "You must pass an email" };

    let isValid = validator.isEmail(email);
    return isValid;
  }
};
