const HttpResponse = require("../../utils/http-response");

module.exports = class VerifyOTPCodeRouter {
	constructor({ verifyOTPCode }) {
		this.verifyOTPCode = verifyOTPCode;
	}

	async handle(httpRequest) {
		if (!httpRequest || !httpRequest.body)
			return HttpResponse.badRequest("Missing Params");

		const { email, otp } = httpRequest.body;

		const verifiedUser = await this.verifyOTPCode.verify({ email, otp });
		if (!verifiedUser.isValidOTP)
			return HttpResponse.badRequest(verifiedUser.body);

		return { body: { email, verifiedUser, otp }, statusCode: 200 };
	}
};
