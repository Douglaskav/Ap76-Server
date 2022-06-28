module.exports = class SendOTPEmailVerification {
	async sendEmailVerification({ userId, email }) {
		if (!userId || !email)
			throw new Error();
	}
};
