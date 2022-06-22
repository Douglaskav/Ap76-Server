const HttpResponseErrors = require("../../utils/http-response-errors");

module.exports = class LoginRouter {
	constructor({ emailValidator, tokenGenerator } = {}) {
		this.emailValidator = emailValidator;
		this.tokenGenerator = tokenGenerator;
	}
	auth(httpRequest) {
		if (!httpRequest || !httpRequest.body)
			return HttpResponseErrors.internalError(
				"A valid httpRequest must be provided"
			);

		const { email, password } = httpRequest.body;
		if (!email) return HttpResponseErrors.badRequest("Missing param email");
		if (!password) return HttpResponseErrors.badRequest("Missing param password");

		if (!this.emailValidator.isValid(email))
			return HttpResponseErrors.badRequest("This is not a valid email");

		const accessToken = this.tokenGenerator.generateToken(email, password);
		if (!accessToken)
			return HttpResponseErrors.unauthorizedError(
				"email or password incorrect"
			);

		return accessToken;
	}
};
