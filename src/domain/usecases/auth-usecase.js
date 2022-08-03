const HttpResponse = require("../../utils/http-response");

module.exports = class AuthUseCase {
	constructor({ loadUserByEmailRepository, tokenGenerator, encrypter } = {}) {
		this.loadUserByEmailRepository = loadUserByEmailRepository;
		this.tokenGenerator = tokenGenerator;
		this.encrypter = encrypter;
	}

	async auth(email, password) {
		if (!email) throw new Error("Missing param email");
		if (!password) throw new Error("Missing param password");

		const user = await this.loadUserByEmailRepository.load(email);
		const isValid = user && (await this.encrypter.compare(password, user.password));

		if (isValid) {
			const accessToken = await this.tokenGenerator.generate(user._id);
			return accessToken;
		}

		return null;
	}
};
