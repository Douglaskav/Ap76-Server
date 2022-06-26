const HttpResponseErrors = require("../../utils/http-response-errors");

module.exports = class CreateUserUseCase {
	constructor({ loadUserByEmailRepository, insertUserRepository, encrypter } = {}) {
		this.loadUserByEmailRepository = loadUserByEmailRepository;
		this.insertUserRepository = insertUserRepository;
		this.encrypter = encrypter;
	}

	async create({ email, username, password }) {
		if (!email || !username || !password) throw new Error("Missing Params");

		const user = await this.loadUserByEmailRepository.load(email);
		if (user) return HttpResponseErrors.conflictError("Already existe an user with this email.");

		let saltRound = 8;
		const hashedPassword = await this.encrypter.generateHash(password,	saltRound);
		if (!hashedPassword) return HttpResponseErrors.internalError("Not was possible encrypted the password");

		const newUserId = await this.insertUserRepository.insert({ email, username, hashedPassword });
		if (!newUserId.insertedId) throw new Error("An insertedId was not returned");

		return { user: newUserId, statusCode: 200 };
	}
};
