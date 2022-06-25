const HttpResponseErrors = require("../../utils/http-response-errors");

module.exports = class CreateUserUseCase {
	async create({ email, username, password }) {
		if (!email || !username || !password) throw new Error();

		return { statusCode: 200 }
	}
}
