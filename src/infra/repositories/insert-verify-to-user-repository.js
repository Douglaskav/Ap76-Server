const MongoHelper = require("../helpers/mongo-helper");
const HttpResponse = require("../../utils/http-response");

module.exports = class InsertVerifyToUser {
  async verify({ email, verifyTo = false }) {
    if (!email) throw new Error("An email must be provided");

    const db = await MongoHelper.db;
    const userModel = db.collection("users");
    const updatedUser = await userModel.updateOne(
      { email },
      { $set: { verified: verifyTo } }
    );
    if (updatedUser.modifiedCount <= 0) return HttpResponse.unauthorizedError("Not was possible update the user");

    return { updatedUser, statusCode: 200 };
  }
};
