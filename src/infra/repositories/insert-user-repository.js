const MongoHelper = require("../helpers/mongo-helper");

module.exports = class InsertUserRepository {
  async insert({ email, username, hashedPassword }) {
    if (!email || !username || !hashedPassword) {
      throw new Error("Missing params");
    }

    const db = await MongoHelper.db;
    const userModel = db.collection("users");
    const user = await userModel.insertOne({
      email,
      username,
      hashedPassword,
      verified: false,
    });

    return user;
  }
};
