const HttpResponseErrors = require("../../utils/http-response-errors");

module.exports = class LoginRouter {
	constructor({ emailValidator, authUseCase } = {}) {
		this.emailValidator = emailValidator;
		this.authUseCase = authUseCase;
	}
	async auth(httpRequest) {
		if (!httpRequest || !httpRequest.body)
			return HttpResponseErrors.internalError(
				"A valid httpRequest must be provided"
			);

		const { email, password } = httpRequest.body;
		if (!email) return HttpResponseErrors.badRequest("Missing param email");
		if (!password) return HttpResponseErrors.badRequest("Missing param password");

		if (!this.emailValidator.isValid(email))
			return HttpResponseErrors.badRequest("This is not a valid email");

		const accessToken = await this.authUseCase.auth(email, password);
		if (!accessToken)
			return HttpResponseErrors.unauthorizedError(
				"email or password incorrect"
			);

		return { accessToken, statusCode: 200 };
	}
};
