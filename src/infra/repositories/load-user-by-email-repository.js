const MongoHelper = require("../helpers/mongo-helper");
const HttpResponseErrors = require("../../utils/http-response-errors");

module.exports = class LoadUserByEmailRepository {
  async load (email) {
    if (!email) return HttpResponseErrors.badRequest("Missing email param");

    await MongoHelper.connect(process.env.MONGO_URL);
    const db = await MongoHelper.db;
    const userModel = db.collection("users");
    const user = await userModel.findOne({
      email
    }, {
      projection: {
        password: 1
      }
    })
    return user
  }
}
