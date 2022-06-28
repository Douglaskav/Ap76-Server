const nodemailer = require("nodemailer");

module.exports = class SendOTPEmailVerification {
	constructor({encrypter, insertOTPRegister, emailManager } = {}) {
		this.encrypter = encrypter;
		this.insertOTPRegister = insertOTPRegister;
		this.emailManager = emailManager
	}

	async sendEmailVerification({ userId, email }) {
		if (!userId || !email) throw new Error("Missing params");

		const otp = `${Math.floor(100000 + Math.random() * 900000)}`;

		const mailOptions = {
			from: process.env.AUTH_EMAIL,
			to: email,
			subject: "Verify your email",
			html: `<p>Enter <b> ${otp}</b> in the app to verify your email address and complete the sign `,
		};

		const SALT_ROUNDS = 8;
//		const hashedOTP = await this.encrypter.generateHash(otp, SALT_ROUNDS);
//		await this.insertOTPRegister.insert({
//			userId,
//			otp: hashedOTP,
//			createdAt: Date.now(),
//			expiresIn: Date.now() + 3600000,
//		});
//
//		let transporter = nodemailer.createTransport({
//			host: "smtp.mailtrap.io",
//			port: 2525,
//			auth: {
//				user: "c4b636db151ed4",
//				pass: "54960aab549892",
//			},
//		});
//
//		let emailSent = await transporter.sendMail(mailOptions);
		return { statusCode: 200 };
	}
};
