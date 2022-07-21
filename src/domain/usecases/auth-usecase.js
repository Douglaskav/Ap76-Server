const HttpResponse = require("../../utils/http-response");

module.exports = class AuthUseCase {
	constructor({
		loadUserByEmailRepository,
		loadOTPRegisterByEmail,
		tokenGenerator,
		encrypter,
	} = {}) {
		this.loadUserByEmailRepository = loadUserByEmailRepository;
		this.loadOTPRegisterByEmail = loadOTPRegisterByEmail;
		this.tokenGenerator = tokenGenerator;
		this.encrypter = encrypter;
	}

	async auth(email, password) {
		if (!email) throw new Error("Missing param email");
		if (!password) throw new Error("Missing param password");

		const user = await this.loadUserByEmailRepository.load(email);
		const isValid =
			user && (await this.encrypter.compare(password, user.password));

		if (isValid) {
			const hasOTPRegister = await this.loadOTPRegisterByEmail.load(user.email);

			if (user.verified && !hasOTPRegister) {
				const accessToken = await this.tokenGenerator.generate(user._id);
				return accessToken;
			}

			return { error: "You must verify your email, please confirm the code." };
		}

		return { error: "email or password incorrect" };
	}
};
