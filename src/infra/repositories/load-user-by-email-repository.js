const MongoHelper = require("../helpers/mongo-helper");
const HttpResponse = require("../../utils/http-response");

module.exports = class LoadUserByEmailRepository {
  async load (email) {
    if (!email) return HttpResponse.badRequest("Missing email param");

    const db = await MongoHelper.db;
    const userModel = db.collection("users");
    const user = await userModel.findOne({
      email
    })
    return user
  }
}
