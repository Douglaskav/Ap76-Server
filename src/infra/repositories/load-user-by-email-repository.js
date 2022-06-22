const httpResponseError = require("../../utils/http-response-errors");
const MongoHelper = require('../helpers/mongo-helper')

module.exports = class LoadUserByEmailRepository {
  async load (email) {
    if (!email) return httpResponseError.badRequest("Missing email");

    const userModel = await MongoHelper.getCollection('users')
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
