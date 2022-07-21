const TokenGenerator = require("../../utils/tokenGenerator");
const EmailValidator = require("../../utils/email-validator");
const Encrypter = require("../../utils/encrypter");
const AuthUseCase = require("../../domain/usecases/auth-usecase");
const AuthUserRouter = require("../../presentation/routers/auth-user-router");
const LoadUserByEmailRepository = require("../../infra/repositories/load-user-by-email-repository");
const LoadOTPRegisterByEmail = require("../../infra/repositories/load-otp-register-by-user-email");

module.exports = class LoginRouterComposer {
  static compose() {
    const tokenGenerator = new TokenGenerator(process.env.JWT_SECRET);
    const emailValidator = new EmailValidator();
    const encrypter = new Encrypter();

    const loadUserByEmailRepository = new LoadUserByEmailRepository();
    const loadOTPRegisterByEmail = new LoadOTPRegisterByEmail();

    const authUseCase = new AuthUseCase({
      loadUserByEmailRepository,
      loadOTPRegisterByEmail,
      tokenGenerator,
      encrypter,
    });
    const authUserRouter = new AuthUserRouter({ authUseCase, emailValidator });
    return authUserRouter;
  }
};
