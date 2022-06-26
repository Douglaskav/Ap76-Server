const HttpResponseErrors = require("../../utils/http-response-errors");

module.exports = class CreateUserUseCase {
	constructor({ loadUserByEmailRepository } = {}) {
		this.loadUserByEmailRepository = loadUserByEmailRepository;
	}

	async create({ email, username, password }) {
		if (!email || !username || !password) throw new Error("Missing Params");
		const user = await this.loadUserByEmailRepository.load(email);	
		if (user) return HttpResponseErrors.conflictError("Already existe an user with this email.");

		return { statusCode: 200 }
	}
}
