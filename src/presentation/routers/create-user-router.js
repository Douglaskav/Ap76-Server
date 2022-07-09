const HttpResponseErrors = require("../../utils/http-response-errors");

module.exports = class LoginRouter {
	constructor({ emailValidator, createUserUseCase, sendOTPEmailVerification } = {}) {
		this.emailValidator = emailValidator;
		this.createUserUseCase = createUserUseCase;
		this.sendOTPEmailVerification = sendOTPEmailVerification;	
	}

	async handle(httpRequest) {
		if (!httpRequest || !httpRequest.body)
			return HttpResponseErrors.internalError(
				"A valid httpRequest must be provided"
			);

		const { username, email, password } = httpRequest.body;
		if (!username) return HttpResponseErrors.badRequest("Missing param username");
		if (!email) return HttpResponseErrors.badRequest("Missing param email");
		if (!password) return HttpResponseErrors.badRequest("Missing param password");

		const isEmailValid = !(await this.emailValidator.isValid(email));
		if (isEmailValid)
			return HttpResponseErrors.badRequest("This is not a valid email");
		

		const newUser = await this.createUserUseCase.create({ email, username, password });
		console.log(newUser);
		if (!newUser) return HttpResponseErrors.internalError("Not was possible to create the user");

		return { body: { email }, statusCode: 200 };
	}
};
