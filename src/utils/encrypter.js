const bcrypt = require("bcrypt");

module.exports = class Encrypter {
  async compare(value, hash) {
    if (!value || !hash) {
      throw new Error("The params are not provided");
    }

    const isValid = await bcrypt.compare(value, hash);
    return isValid;
  }

  async hashSync(password, saltRound) {
    if (!password || !saltRound) throw new Error();

    let hashedPassword = bcrypt.hashSync(password, saltRound);

    return hashedPassword;
  }
};
