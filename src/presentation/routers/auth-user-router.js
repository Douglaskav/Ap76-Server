const HttpResponse = require("../../utils/http-response");

module.exports = class LoginRouter {
	constructor({ emailValidator, authUseCase } = {}) {
		this.emailValidator = emailValidator;
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

			const accessToken = await this.authUseCase.auth(email, password);
			if (!accessToken) {
				return HttpResponse.unauthorizedError("email or password incorrect");
			}

			return HttpResponse.success({ email, accessToken });
		} catch (error) {
			return HttpResponse.internalError("Oh no! An internal error occured.");
		}
	}
};
