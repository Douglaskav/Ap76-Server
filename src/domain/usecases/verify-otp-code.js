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

	async verify({ email, otp }) {
		if (!email || !otp)
			throw new Error("email and OTP_code should be provided");

		const otpVerificationCode = await this.loadOTPRegisterByEmail.load(email);
		if (!otpVerificationCode) return null;

		const { expiresIn, otp: hashedOTP } = otpVerificationCode;

		if (Date.now() > expiresIn) {
			await this.deleteOTPRegisterByEmail.deleteMany({ email });
			return null;
		}

		const isValidOTP = await this.encrypter.compare(otp, hashedOTP);
		if (!isValidOTP) return null;

		await this.insertVerifyToUser.verify({ email, verifyTo: true });
		await this.deleteOTPRegisterByEmail.deleteMany(email);

		return isValidOTP;
	}
};
