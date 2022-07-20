const HttpResponse = require("../../utils/http-response");

module.exports = class SendOTPEmailVerification {
	constructor({ encrypter, insertOTPRegister, deleteOTPRegister, emailManager } = {}) {
		this.encrypter = encrypter;
		this.insertOTPRegister = insertOTPRegister;
		this.deleteOTPRegister = deleteOTPRegister;
		this.emailManager = emailManager;
	}

	async sendEmailVerification(email) {
		if (!email) return HttpResponse.badRequest("Missing params");

		await this.deleteOTPRegister.deleteMany(email);

		const otp = `${Math.floor(100000 + Math.random() * 900000)}`;

		const mailOptions = {
			from: process.env.AUTH_EMAIL,
			to: email,
			subject: "Verify your email",
			html: `<p>Enter <b> ${otp}</b> in the app to verify your email address and complete the sign `,
		};

		const SALT_ROUNDS = 8;
		const hashedOTP = await this.encrypter.generateHash(otp, SALT_ROUNDS);
		if (!hashedOTP) return HttpResponse.internalError("Error while trying encrypt OTP Code");

		await this.insertOTPRegister.insert({
			email,
			otp: hashedOTP,
			createdAt: Date.now(),
			expiresIn: Date.now() + 3600000,
		});

		let sentEmail = await this.emailManager.sendMail(mailOptions);
		if (!sentEmail || !sentEmail.messageId)
			return HttpResponse.internalError("Not was possible send the email");

		return sentEmail;
	}
};
