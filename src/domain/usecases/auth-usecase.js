const HttpResponseErrors = require("../../utils/http-response-errors");

module.exports = class AuthUseCase {
	constructor({ loadUserByEmailRepository, tokenGenerator, encrypter } = {}) {
		this.loadUserByEmailRepository = loadUserByEmailRepository;
		this.tokenGenerator = tokenGenerator;
		this.encrypter = encrypter;
	}

	async auth(email, password) {
		if (!email) return HttpResponseErrors.badRequest("Missing param email");
		if (!password)
			return HttpResponseErrors.badRequest("Missing param password");

		const user = await this.loadUserByEmailRepository.load(email);
		const isValid = user && await this.encrypter.compare(password, user.password);
		if (isValid) {
			// Checar se o usuário é verificado.
			const accessToken = await this.tokenGenerator.generate(user._id);
			return accessToken;
		}

		return null;
	}
}
