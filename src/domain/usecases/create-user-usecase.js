const HttpResponse = require("../../utils/http-response");

module.exports = class CreateUserUseCase {
	constructor({
		loadUserByEmailRepository,
		insertUserRepository,
		encrypter,
	} = {}) {
		this.loadUserByEmailRepository = loadUserByEmailRepository;
		this.insertUserRepository = insertUserRepository;
		this.encrypter = encrypter;
	}

	async create({ email, username, password }) {
		if (!email || !username || !password) throw new Error("Missing Params");

		const user = await this.loadUserByEmailRepository.load(email);
		if (user)
			return HttpResponse.conflictError(
				"Already existe an user with this email."
			);

		const SALT_ROUNDS = 8;
		const hashedPassword = await this.encrypter.generateHash(
			password,
			SALT_ROUNDS	
		);
		if (!hashedPassword)
			return HttpResponse.internalError(
				"Not was possible encrypted the password"
			);

		const newUser = await this.insertUserRepository.insert({
			email,
			username,
			password: hashedPassword,
			verified: false,
		});
		if (!newUser.insertedId) throw new Error("An insertedId was not returned");

		return { insertedId: newUser.insertedId };
	}
};
