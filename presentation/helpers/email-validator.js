const validator = require("validator");

module.exports = class EmailValidator {
  isValid(email) {
    if (!email) throw new Error();

    let isValid = validator.isEmail(email);
    return isValid;
  }
}
