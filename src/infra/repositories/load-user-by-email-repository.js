const MongoHelper = require('../helpers/mongo-helper')
const HttpResponseErrors = require("../../utils/http-response-errors");

module.exports = class LoadUserByEmailRepository {
  async load (email) {
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
