const VerifyOTPCodeRouter = require("../../presentation/routers/verify-otp-code-router");
const VerifyOTPCode = require("../../domain/usecases/verify-otp-code");
const LoadOTPRegisterByEmail = require("../../infra/repositories/load-otp-register-by-user-email");

const DeleteOTPRegisterByEmail = require("../../infra/repositories/delete-otp-register-by-email");
const InsertVerifyToUser = require("../../infra/repositories/insert-verify-to-user-repository");
const Encrypter = require("../../utils/encrypter");

module.exports = class VerifyUserRouterComposer {
	static compose() {
		const loadOTPRegisterByEmail = new LoadOTPRegisterByEmail();
		const deleteOTPRegisterByEmail = new DeleteOTPRegisterByEmail();
		const insertVerifyToUser = new InsertVerifyToUser();
		const encrypter = new Encrypter();

		const verifyOTPCode = new VerifyOTPCode({
			loadOTPRegisterByEmail,
			deleteOTPRegisterByEmail,
			insertVerifyToUser,
			encrypter,
		});

		const verifyOTPCodeRouter = new VerifyOTPCodeRouter({ verifyOTPCode });
		return verifyOTPCodeRouter;
	}
};
