const HttpResponseErrors = require("../../utils/http-response-errors");

module.exports = class VerifyOTPCodeRouter {
	constructor({ verifyOTPCode }) {
		this.verifyOTPCode = verifyOTPCode;
	}

	async handle(httpRequest) {
		if (!httpRequest || !httpRequest.body)
			return HttpResponseErrors.badRequest("Missing Params");

		const { email, otp } = httpRequest.body;

		const verifiedUser = await this.verifyOTPCode.verify({ email, otp });
		if (!verifiedUser.isValidOTP)
			return HttpResponseErrors.badRequest(verifiedUser.body);

		return { body: { email, verifiedUser, otp }, statusCode: 200 };
	}
};
