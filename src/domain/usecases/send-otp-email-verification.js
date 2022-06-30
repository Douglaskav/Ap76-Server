const HttpResponseErrors = require("../../utils/http-response-errors");

module.exports = class SendOTPEmailVerification {
	constructor({ encrypter, insertOTPRegister, deleteOTPRegister, emailManager } = {}) {
		this.encrypter = encrypter;
		this.insertOTPRegister = insertOTPRegister;
		this.deleteOTPRegister = deleteOTPRegister;
		this.emailManager = emailManager;
	}

	async sendEmailVerification({ _id, email }) {
		if (!_id || !email) throw new Error("Missing params");

		await this.deleteOTPRegister.deleteMany(_id);

		const otp = `${Math.floor(100000 + Math.random() * 900000)}`;

		const mailOptions = {
			from: process.env.AUTH_EMAIL,
			to: email,
			subject: "Verify your email",
			html: `<p>Enter <b> ${otp}</b> in the app to verify your email address and complete the sign `,
		};

		const SALT_ROUNDS = 8;
		const hashedOTP = await this.encrypter.generateHash(otp, SALT_ROUNDS);
		if (!hashedOTP) throw new Error("Error while trying encrypt OTP Code");

		await this.insertOTPRegister.insert({
			_id,
			otp: hashedOTP,
			createdAt: Date.now(),
			expiresIn: Date.now() + 3600000,
		});

		let emailSent = await this.emailManager.sendMail(mailOptions);
		if (!emailSent.messageId)
			return HttpResponseErrors.internalError(
				"Not was possible send the email"
			);

		return { emailSent, statusCode: 200 };
	}
};
