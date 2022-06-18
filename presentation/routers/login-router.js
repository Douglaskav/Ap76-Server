const HttpResponseErrors = require("../helpers/http-response-errors");
const isValid = require("../helpers/email-validator");

module.exports = class LoginRouter {
	constructor({ emailValidator }) {
		this.emailValidator = emailValidator;
	}
	auth(httpRequest) {
		const { email, password } = httpRequest.body;
		if (!email) return HttpResponseErrors.badRequest("email");
		if (!password) return HttpResponseErrors.badRequest("password");

		if (!this.emailValidator.isValid(email))
			return HttpResponseErrors.badRequest("email");
	}
};
