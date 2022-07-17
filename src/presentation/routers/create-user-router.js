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

		if (!newUser.insertedId)
			return HttpResponseErrors.internalError(
				"Not was possible to create the user"
			);

		const emailSent = await this.sendOTPEmailVerification.sendEmailVerification(
			{ userId: newUser.insertedId, email }
		);
		if (!emailSent || !emailSent.sentEmail)
			return HttpResponseErrors.internalError(
				"An error occured while the email was sending"
			);

		const { messageId, envelope } = emailSent.sentEmail;

		return { body: { userId: newUser.insertedId, email, messageId, envelope }, statusCode: 200 };
	}
};
