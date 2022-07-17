const HttpResponseErrors = require("../../utils/http-response-errors");

module.exports = class VerifyOTPCode {
	constructor({
		loadOTPRegisterByEmail,
		deleteOTPRegisterByEmail,
		insertVerifyToUser,
		encrypter,
	}) {
		this.loadOTPRegisterByEmail = loadOTPRegisterByEmail;
		this.deleteOTPRegisterByEmail = deleteOTPRegisterByEmail;
		this.insertVerifyToUser = insertVerifyToUser;
		this.encrypter = encrypter;
	}

	async verifyCode({ email, otp }) {
		if (!email || !otp) throw new Error("email and OTP_code should be provided");

		const otpVerificationCode =
			await this.loadOTPRegisterByEmail.load(email);

		if (otpVerificationCode.length <= 0)
			throw new Error("Not was found an OTPRegistry for this user.");

		const { expiresIn, otp: hashedOTP } = otpVerificationCode;
		if (Date.now() > expiresIn) {
			await this.deleteOTPRegisterByEmail.deleteMany({ email });
			return HttpResponseErrors.unauthorizedError(
				"Code has expired. Please request another"
			);
		}

		const isValidOTP = await this.encrypter.compare(otp, hashedOTP);
		if (!isValidOTP)
			return HttpResponseErrors.unauthorizedError(
				"Invalid code passed; Check your email"
			);

		await this.insertVerifyToUser.verify({ email, verifyTo: true });
		await this.deleteOTPRegisterByEmail.deleteMany({ email });

		return { isValidOTP, statusCode: 200 };
	}
};
