const MongoHelper = require("../helpers/mongo-helper");

module.exports = class DeleteOTPRegisteryByEmail {
  async deleteMany(email) {
    if (!email) throw new Error("An Email must be provided");

    const db = await MongoHelper.db;
    const optModel = db.collection("otpRegisters");
    const deletedOTPRegister = await optModel.deleteMany({ email });

    return { deletedOTPRegister, statusCode: 200 }
  }
}
