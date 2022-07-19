const MongoHelper = require("../helpers/mongo-helper");
const HttpResponse = require("../../utils/http-response");

module.exports = class LoadOTPRegisterByEmail {
  async load (email) {
    if (!email) return HttpResponse.badRequest("Missing email param");

    const db = await MongoHelper.db;
    const otpModel = db.collection("otpRegisters");
    const user = await otpModel.findOne({ email });

    return user;
  }
}
