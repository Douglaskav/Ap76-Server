const MongoHelper = require("../helpers/mongo-helper");

module.exports = class InsertUserRepository {
  async insert({ email, username, password }) {
    if (!email || !username || !password) {
      throw new Error("Missing params");
    }

    const db = await MongoHelper.db;
    const userModel = db.collection("users");
    const user = await userModel.insertOne({
      email,
      username,
      password,
      verified: false,
    });

    return user;
  }
};
