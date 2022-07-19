const HttpResponse = require("../../utils/http-response");

module.exports = class VerifyOTPCodeRouter {
	constructor({ verifyOTPCode }) {
		this.verifyOTPCode = verifyOTPCode;
	}

	async handle(httpRequest) {
		try {
			const { email, otp } = httpRequest.body;

			const verifiedUser = await this.verifyOTPCode.verify({ email, otp });
			if (!verifiedUser.isValidOTP)
				return HttpResponse.badRequest(verifiedUser.body);

			return HttpResponse.success({ email, verifiedUser, otp });
		} catch (error) {
			return HttpResponse.internalError("Oh no! An internal error occured.");
		}
	}
};
