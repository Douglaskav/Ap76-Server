const HttpResponse = require("../../utils/http-response");

module.exports = class LoginRouter {
	constructor({ emailValidator, loadOTPRegisterByEmail, authUseCase } = {}) {
		this.emailValidator = emailValidator;
		this.loadOTPRegisterByEmail = loadOTPRegisterByEmail;
		this.authUseCase = authUseCase;
	}

	async handle(httpRequest) {
		try {
			const { email, password } = httpRequest.body;
			if (!email || !password) {
				return HttpResponse.badRequest("Missing params");
			}

			if (!this.emailValidator.isValid(email)) {
				return HttpResponse.badRequest("This is not a valid email");
			}

			const emailIsNotVerified = await this.loadOTPRegisterByEmail.load(email);
			if (emailIsNotVerified) {
				return HttpResponse.unauthorizedError("You must verify your email.");
			}

			const accessToken = await this.authUseCase.auth(email, password);
			if (!accessToken) {
				return HttpResponse.unauthorizedError("Email or password wrong");
			}

			return HttpResponse.success({ email, accessToken });
		} catch (error) {
			return HttpResponse.internalError("Oh no! An internal error occured.");
		}
	}
};
