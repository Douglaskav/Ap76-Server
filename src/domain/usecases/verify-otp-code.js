const HttpResponseErrors = require("../../utils/http-response-errors");

module.exports = class VerifyOTPCode {
	constructor({
		findOTPRegisterByUserId,
		deleteOTPRegisterByUserId,
		insertVerifyToUser,
		encrypter,
	}) {
		this.findOTPRegisterByUserId = findOTPRegisterByUserId;
		this.deleteOTPRegisterByUserId = deleteOTPRegisterByUserId;
		this.insertVerifyToUser = insertVerifyToUser;
		this.encrypter = encrypter;
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

		const isValidOTP = await this.encrypter.compare(otp, hashedOTP);
		if (!isValidOTP)
			return HttpResponseErrors.unauthorizedError(
				"Invalid code passed; Check your email"
			);

		await this.insertVerifyToUser.verify({ _id, verifyTo: true });
		await this.deleteOTPRegisterByUserId.deleteMany({ _id });

		return { isValid: true, hashedOTP, statusCode: 200 };
	}
};
