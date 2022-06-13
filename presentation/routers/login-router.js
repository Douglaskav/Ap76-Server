const HttpResponseErrors = require("../helpers/http-response-errors");

module.exports = class LoginRouter {
	auth(httpRequest) {
		const { email, password } = httpRequest.body;
		if (!email) return HttpResponseErrors.badRequest('email'); 
		if (!password) return HttpResponseErrors.badRequest('password');
	}
}
