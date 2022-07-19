const HttpResponse = require("../../utils/http-response");

module.exports = class AuthUseCase {
	constructor({ loadUserByEmailRepository, tokenGenerator, encrypter } = {}) {
		this.loadUserByEmailRepository = loadUserByEmailRepository;
		this.tokenGenerator = tokenGenerator;
		this.encrypter = encrypter;
	}

	async auth(email, password) {
		if (!email) return HttpResponse.badRequest("Missing param email");
		if (!password)
			return HttpResponse.badRequest("Missing param password");

		const user = await this.loadUserByEmailRepository.load(email);
		const isValid = user && await this.encrypter.compare(password, user.password);
		if (isValid) {
			/**
			 * @todo [checar se o usuário é verificado]
			 **/

			const accessToken = await this.tokenGenerator.generate(user._id);
			return accessToken;
		}

		return null;
	}
}
