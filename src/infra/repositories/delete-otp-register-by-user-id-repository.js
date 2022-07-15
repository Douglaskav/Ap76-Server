const MongoHelper = require("../helpers/mongo-helper");

module.exports = class DeleteOTPRegisteryByUserId {
  async deleteMany(userId) {
    if (!userId) throw new Error("An UserId must be provided");

    const db = await MongoHelper.db;
    const optModel = db.collection("otpRegisters");
    const deletedOTPRegister = await optModel.deleteMany({ userId });

    return { deletedOTPRegister, statusCode: 200 }
  }
}
