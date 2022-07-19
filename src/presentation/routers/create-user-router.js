const HttpResponse = require("../../utils/http-response");

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
			return HttpResponse.internalError("A valid httpRequest must be provided");

		const { username, email, password } = httpRequest.body;

		const isEmailValid = !(await this.emailValidator.isValid(email));
		if (isEmailValid)
			return HttpResponse.badRequest("This is not a valid email");

		if (!username || !email || !password)
			return HttpResponse.badRequest("Missing param");

		const { insertedId: userId } = await this.createUserUseCase.create({
			email,
			username,
			password,
		});

		if (!userId)
			return HttpResponse.internalError("Not was possible to create the user");

		const emailSent = await this.sendOTPEmailVerification.sendEmailVerification(
			{ userId, email }
		);
		if (!emailSent)
			return HttpResponse.internalError(
				"An error occured while the email was sending"
			);

		const { messageId, envelope, otp } = emailSent;

		return HttpResponse.success({
			userId,
			email,
			messageId,
			envelope,
			otp,
		});
	}
};
