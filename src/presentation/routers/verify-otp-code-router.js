const HttpResponseErrors = require("../../utils/http-response-errors");

module.exports = class VerifyOTPCodeRouter {
	constructor({ verifyOTPCode }) {
		this.verifyOTPCode = verifyOTPCode;
	}

	async handle(httpRequest) {
		if (!httpRequest || !httpRequest._id || !httpRequest.otp)
			return HttpResponseErrors.badRequest("Missing Params");

		const { _id, otp } = httpRequest;

		const verifiedUser = await this.verifyOTPCode.verifyCode({ _id, otp });
		if (!verifiedUser.isValidOTP)
			return HttpResponseErrors.badRequest("Not was possible check the code");

		return { _id, verifiedUser };
	}
};
