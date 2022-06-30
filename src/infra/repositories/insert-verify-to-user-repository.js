const MongoHelper = require("../helpers/mongo-helper");

module.exports = class InsertVerifyToUser {
  async verify({ _id, verifyTo = false }) {
    if (!_id) throw new Error("An userId must be provided");

    const db = await MongoHelper.db;
    const userModel = db.collection("users");
    const updatedUser = await userModel.updateOne(
      { _id },
      { $set: { verified: verifyTo } }
    );
    if (updatedUser.modifiedCount <= 0)
      throw new Error("Not was possible update the user");

    return { updatedUser, statusCode: 200 };
  }
};
