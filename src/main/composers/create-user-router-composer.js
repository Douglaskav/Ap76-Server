const CreateUserRouter = require("../../presentation/routers/create-user-router");
const EmailValidator = require("../../utils/email-validator");
const CreateUserUseCase = require("../../domain/usecases/create-user-usecase");
const SendOTPEmailVerification = require("../../domain/usecases/send-otp-email-verification");
const LoadUserByEmailRepository = require("../../infra/repositories/load-user-by-email-repository");
const InsertUserRepository = require("../../infra/repositories/insert-user-repository");
const Encrypter = require("../../utils/encrypter");
const InsertOTPRegisteryRepository = require("../../infra/repositories/insert-otp-registery-repository");
const DeleteOTPRegisteryByEmailRepository = require("../../infra/repositories/delete-otp-register-by-email");
const EmailManager = require("../../utils/email-manager");

module.exports = class CreateUserRouterComposer {
  static compose() {
    const emailValidator = new EmailValidator();

    const insertUserRepository = new InsertUserRepository();
    const encrypter = new Encrypter();
    const createUserUseCase = new CreateUserUseCase({
      insertUserRepository,
      encrypter,
    });

    const insertOTPRegister = new InsertOTPRegisteryRepository();
    const deleteOTPRegister = new DeleteOTPRegisteryByEmailRepository();
    const emailManager = new EmailManager();
    const sendOTPEmailVerification = new SendOTPEmailVerification({
      encrypter,
      insertOTPRegister,
      deleteOTPRegister,
      emailManager,
    });
    const loadUserByEmailRepository = new LoadUserByEmailRepository();

    const createUserRouter = new CreateUserRouter({
      emailValidator,
      createUserUseCase,
      loadUserByEmailRepository,
      sendOTPEmailVerification,
    });
    return createUserRouter;
  }
};
