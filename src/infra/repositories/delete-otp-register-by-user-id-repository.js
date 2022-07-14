const MongoHelper = require("../helpers/mongo-helper");

module.exports = class DeleteOTPRegisteryByUserId {
  async deleteMany(_id) {
    if (!_id) throw new Error("An UserId must be provided");

    const db = await MongoHelper.db;
    const optModel = db.collection("otpRegisters");
    const deletedOTPRegister = await optModel.deleteMany({ _id });

    return { deletedOTPRegister, statusCode: 200 }
  }
}
