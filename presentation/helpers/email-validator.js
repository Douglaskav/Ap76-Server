const validator = require("validator");

const isValid = (email) => {
    if (!email) return { error: 400, message: "You must pass an email" };

    let isValid = validator.isEmail(email);
    return isValid;
  }

module.exports = isValid
