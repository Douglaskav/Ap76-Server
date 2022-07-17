const MongoHelper = require("../helpers/mongo-helper");
const HttpResponseErrors = require("../../utils/http-response-errors");

module.exports = class InsertVerifyToUser {
  async verify({ email, verifyTo = false }) {
    if (!email) throw new Error("An email must be provided");

    const db = await MongoHelper.db;
    const userModel = db.collection("users");
    const updatedUser = await userModel.updateOne(
      { email },
      { $set: { verified: verifyTo } }
    );
    if (updatedUser.modifiedCount <= 0)
      //Move to an httpResponseError
      throw new Error("Not was possible update the user");

    return { updatedUser, statusCode: 200 };
  }
};
