const TokenGenerator = require("../../utils/tokenGenerator");
const EmailValidator = require("../../utils/email-validator");
const EmailManager = require("../../utils/email-manager");
const Encrypter = require("../../utils/encrypter");
const AuthUseCase = require("../../domain/usecases/auth-usecase");
const LoginRouter = require("../../presentation/routers/login-router");
const DeleteOTPRegisterByUserIdRepository = require("../../infra/repositories/delete-otp-register-by-user-id-repository");
const InsertOTPRegisterRepository = require("../../infra/repositories/insert-otp-registery-repository");
const InsertUserRepository = require("../../infra/repositories/insert-user-repository");
const InsertVerifyToUserRepository = require("../../infra/repositories/insert-verify-to-user-repository");
const LoadUserByEmailRepository = require("../../infra/repositories/load-user-by-email-repository");

module.exports = class LoginRouterComposer {
  static compose() {
    const tokenGenerator = new TokenGenerator(process.env.JWT_SECRET); 
    const emailValidator = new EmailValidator();
    const encrypter = new Encrypter();

    const loadUserByEmailRepository = new LoadUserByEmailRepository();

    const authUseCase = new AuthUseCase({ loadUserByEmailRepository, tokenGenerator, encrypter });
    const loginRouter = new LoginRouter({ authUseCase, emailValidator });    
    return loginRouter
  }
}
