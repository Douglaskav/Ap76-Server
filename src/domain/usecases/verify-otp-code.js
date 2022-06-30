const HttpResponseErrors = require("../../utils/http-response-errors");

module.exports = class VerifyOTPCode {
	constructor({ findOTPRegisterByUserId, deleteOTPRegisterByUserId }) {
		this.findOTPRegisterByUserId = findOTPRegisterByUserId;
		this.deleteOTPRegisterByUserId = deleteOTPRegisterByUserId;
	}

	async verifyCode({ _id, otp }) {
		if (!_id | !otp) throw new Error("userId and OTP_code should be provided");

		const OTPVerificationRecords = await this.findOTPRegisterByUserId.find({
			_id,
		});
		if (OTPVerificationRecords.length <= 0)
			throw new Error("Not was found an OTPRegistry for this user.");

		const { expiresIn, otp: hashedOTP } = OTPVerificationRecords[0];
		if (Date.now() > expiresIn) {
			await this.deleteOTPRegisterByUserId.deleteMany({ _id });
			return HttpResponseErrors.unauthorizedError(
				"Code has expired. Please request another"
			);
		}

		return { isValid: true, hashedOTP, statusCode: 200 };
	}
};
