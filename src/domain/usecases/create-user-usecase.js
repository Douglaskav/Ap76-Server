const HttpResponseErrors = require("../../utils/http-response-errors");

module.exports = class CreateUserUseCase {
	constructor({ loadUserByEmailRepository, encrypter } = {}) {
		this.loadUserByEmailRepository = loadUserByEmailRepository;
		this.encrypter = encrypter;
	}

	async create({ email, username, password }) {
		if (!email || !username || !password) throw new Error("Missing Params");

		const user = await this.loadUserByEmailRepository.load(email);	
		if (user) return HttpResponseErrors.conflictError("Already existe an user with this email.");

		let saltRound = 8;
		const hashedPassword = this.encrypter.hashSync(password, saltRound);

		return { statusCode: 200 }
	}
}
