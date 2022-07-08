const TokenGenerator = require("../../utils/tokenGenerator");
const EmailValidator = require("../../utils/email-validator");
const Encrypter = require("../../utils/encrypter");
const AuthUseCase = require("../../domain/usecases/auth-usecase");
const AuthUserRouter = require("../../presentation/routers/auth-user-router");
const LoadUserByEmailRepository = require("../../infra/repositories/load-user-by-email-repository");

module.exports = class LoginRouterComposer {
  static compose() {
    const tokenGenerator = new TokenGenerator(process.env.JWT_SECRET); 
    const emailValidator = new EmailValidator();
    const encrypter = new Encrypter();

    const loadUserByEmailRepository = new LoadUserByEmailRepository();

    const authUseCase = new AuthUseCase({ loadUserByEmailRepository, tokenGenerator, encrypter });
    const authUserRouter = new AuthUserRouter({ authUseCase, emailValidator });    
    return authUserRouter;
  }
}
