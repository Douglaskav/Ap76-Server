const HttpResponseErrors = require("../helpers/http-response-errors");

module.exports = class LoginRouter {
	constructor({ emailValidator, tokenGenerator }) {
		this.emailValidator = emailValidator;
		this.tokenGenerator = tokenGenerator;
	}
	auth(httpRequest) {
		if (!httpRequest || !httpRequest.body)
			return HttpResponseErrors.internalError("A valid httpRequest must be provided");

		const { email, password } = httpRequest.body;
		if (!email) return HttpResponseErrors.badRequest("email");
		if (!password) return HttpResponseErrors.badRequest("password");

		if (!this.emailValidator.isValid(email))
			return HttpResponseErrors.badRequest("email");

		const accessToken = this.tokenGenerator.generateToken(email, password);		
		if (!accessToken) return HttpResponseErrors.unauthorizedError("email or password incorrect");

		return accessToken;
	}
};
