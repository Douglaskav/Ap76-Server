const ResendOTPCodeRouter = require("../../presentation/routers/resend-otp-code-router");
const SendOTPEmailVerification = require("../../domain/usecases/send-otp-email-verification");
const Encrypter = require("../../utils/encrypter");
const InsertOTPRegisteryRepository = require("../../infra/repositories/insert-otp-registery-repository");
const DeleteOTPRegisteryByEmailRepository = require("../../infra/repositories/delete-otp-register-by-email");
const EmailManager = require("../../utils/email-manager");

const LoadOTPRegisterByEmail = require("../../infra/repositories/load-otp-register-by-user-email");

module.exports = class ResendOTPCodeComposer {
	static compose() {
		const encrypter = new Encrypter();
		const insertOTPRegister = new InsertOTPRegisteryRepository();
		const deleteOTPRegister = new DeleteOTPRegisteryByEmailRepository();
		const emailManager = new EmailManager();

		const sendOTPEmailVerification = new SendOTPEmailVerification({
			encrypter,
			insertOTPRegister,
			deleteOTPRegister,
			emailManager,
		});

		const loadOTPRegisterByEmail = new LoadOTPRegisterByEmail();

		const resendOTPCodeRouter = new ResendOTPCodeRouter({
			sendOTPEmailVerification,
			loadOTPRegisterByEmail,
		});
		
		return resendOTPCodeRouter;
	}
};
