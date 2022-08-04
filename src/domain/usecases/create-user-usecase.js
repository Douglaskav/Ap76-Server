module.exports = class CreateUserUseCase {
	constructor({ insertUserRepository, encrypter } = {}) {
		this.insertUserRepository = insertUserRepository;
		this.encrypter = encrypter;
	}

	async create({ email, username, password }) {
		if (!email || !username || !password) throw new Error("Missing Params");

		const SALT_ROUNDS = 8;
		const hashedPassword = await this.encrypter.generateHash(
			password,
			SALT_ROUNDS
		);
		if (!hashedPassword)
			throw new Error("Not was possible encrypted the password");

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
