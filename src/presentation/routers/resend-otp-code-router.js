const HttpResponse = require("../../utils/http-response");

module.exports = class ResendOTPCodeRouter {
	constructor({ sendOTPEmailVerification, loadOTPRegisterByEmail }) {
		this.sendOTPEmailVerification = sendOTPEmailVerification;
		this.loadOTPRegisterByEmail = loadOTPRegisterByEmail;
	}

	async handle(httpRequest) {
		try {
			const { email } = httpRequest.body;

			if (!email) {
				return HttpResponse.badRequest("Missing email param");
			}

			const otpRegister = await this.loadOTPRegisterByEmail.load(email);
			if (!otpRegister)
				return HttpResponse.unauthorizedError(
					"This user it's already verified or not exists, please login or sign up."
				);

			const sentEmail =
				await this.sendOTPEmailVerification.sendEmailVerification(email);

			if (!sentEmail) {
				return HttpResponse.internalError(
					"An error occured while the email was sending"
				);
			}

			const { messageId, envelope } = sentEmail;

			return HttpResponse.success({ messageId, envelope });
		} catch (error) {
			return HttpResponse.internalError("Oh no! An internal error occured.");
		}
	}
};
