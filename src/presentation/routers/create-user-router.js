const HttpResponseErrors = require("../../utils/http-response-errors");

module.exports = class LoginRouter {
	constructor({
		emailValidator,
		createUserUseCase,
		sendOTPEmailVerification,
	} = {}) {
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

		const isEmailValid = !(await this.emailValidator.isValid(email));
		if (isEmailValid) return HttpResponseErrors.badRequest("This is not a valid email");

		if (!username || !email || !password) return HttpResponseErrors.badRequest("Missing param");


		const newUser = await this.createUserUseCase.create({
			email,
			username,
			password,
		});
		if (!newUser)
			return HttpResponseErrors.internalError(
				"Not was possible to create the user"
			);

		const sentEmail = await this.sendOTPEmailVerification.sendEmailVerification(
			{ _id: newUser._id, email }
		);
		if (!sentEmail)
			return HttpResponseErrors.internalError(
				"An error occured while the email was sending"
			);

		return { body: { email, sentEmail }, statusCode: 200 };
	}
};
