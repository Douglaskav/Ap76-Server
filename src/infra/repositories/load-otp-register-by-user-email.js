const MongoHelper = require("../helpers/mongo-helper");
const HttpResponseErrors = require("../../utils/http-response-errors");

module.exports = class LoadOTPRegisterByEmail {
  async load (email) {
    if (!email) return HttpResponseErrors.badRequest("Missing email param");

    const db = await MongoHelper.db;
    const otpModel = db.collection("otpRegisters");
    const user = await otpModel.findOne({ email });

    return user;
  }
}
