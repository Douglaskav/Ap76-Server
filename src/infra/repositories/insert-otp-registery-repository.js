const MongoHelper = require("../helpers/mongo-helper");

module.exports = class InsertOTPRegisteryRepository {
  async insert(otpRegister) {
    if (
      !otpRegister ||
      !otpRegister.email ||
      !otpRegister.otp ||
      !otpRegister.createdAt ||
      !otpRegister.expiresIn
    )
      throw new Error("Missing OTPRepository params");

    const db = await MongoHelper.db;
    const otpModel = db.collection("otpRegisters");     
    const insertedOtpRegister = await otpModel.insertOne(otpRegister); 

    return insertedOtpRegister;
  }
};
