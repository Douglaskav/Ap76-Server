const MongoHelper = require("../helpers/mongo-helper");

module.exports = class DeleteOTPRegisteryByUserId {
  async deleteMany(userId) {
    if (!userId) throw new Error("An UserId must be provided");

    const db = await MongoHelper.db;
    const optModel = db.collection("otpRegisters");
    const deletedOTPRegister = await optModel.deleteMany({ _id: userId });
    if (deletedOTPRegister.deletedCount <= 0) throw new Error("Not was possible delete the OTPRegister");


    return { deletedOTPRegister, statusCode: 200 }
  }
}
