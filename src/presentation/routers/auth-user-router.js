const HttpResponse = require("../../utils/http-response");

module.exports = class LoginRouter {
	constructor({ emailValidator, authUseCase } = {}) {
		this.emailValidator = emailValidator;
		this.authUseCase = authUseCase;
	}

	async handle(httpRequest) {
		if (!httpRequest || !httpRequest.body)
			return HttpResponse.internalError(
				"A valid httpRequest must be provided"
			);

		const { email, password } = httpRequest.body;
		if (!email) return HttpResponse.badRequest("Missing param email");
		if (!password)
			return HttpResponse.badRequest("Missing param password");

		const isEmailValid = !(await this.emailValidator.isValid(email));
		if (isEmailValid)
			return HttpResponse.badRequest("This is not a valid email");

		const accessToken = await this.authUseCase.auth(email, password);
		if (!accessToken)
			return HttpResponse.unauthorizedError(
				"email or password incorrect"
			);

		return HttpResponse.success({ email, accessToken });
	}
};
