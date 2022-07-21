const HttpResponse = require("../../utils/http-response");

module.exports = class VerifyOTPCodeRouter {
	constructor({ verifyOTPCode }) {
		this.verifyOTPCode = verifyOTPCode;
	}

	async handle(httpRequest) {
		try {
			const { email, otp } = httpRequest.body;
			if (!email || !otp) return HttpResponse.badRequest("Missing params");

			const verifiedUser = await this.verifyOTPCode.verify({ email, otp });
			if (!verifiedUser.isValidOTP)
				return HttpResponse.unauthorizedError("Not was possible verify the user!");

			return HttpResponse.success({ email, verifiedUser });
		} catch (error) {
			return HttpResponse.internalError("Oh no! An internal error occured.");
		}
	}
};
