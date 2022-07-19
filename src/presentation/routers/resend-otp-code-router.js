const HttpResponse = require("../../utils/http-response");

module.exports = class ResendOTPCodeRouter {
	constructor({ sendOTPEmailVerification }) {
		this.sendOTPEmailVerification = sendOTPEmailVerification;
	}

	async handle(httpRequest) {
		try {
			const { email } = httpRequest.body;

			if (!email) {
				return HttpResponse.badRequest("Missing email param");
			}

			const sentEmail =
				await this.sendOTPEmailVerification.sendEmailVerification(email);

			if (!sentEmail) {
				return HttpResponse.internalError("An error occured while the email was sending");
			}

			const { messageId, envelope, otp } = sentEmail;

			return HttpResponse.success({ messageId, envelope, otp });
		} catch (error) {
			return HttpResponse.internalError("Oh no! An internal error occured.");
		}
	}
};
