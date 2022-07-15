const MongoHelper = require("../helpers/mongo-helper");
const HttpResponseErrors = require("../../utils/http-response-errors");

module.exports = class LoadOTPRegisterByUserIdRepository {
  async load (userId) {
    if (!userId) return HttpResponseErrors.badRequest("Missing userId param");

    const db = await MongoHelper.db;
    const otpModel = db.collection("otpRegisters");
    const user = await otpModel.findOne({
      _id: userId
    })
    return user
  }
}
