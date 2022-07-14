const CreateUserRouter = require("../../presentation/routers/create-user-router");

const EmailValidator = require("../../utils/email-validator");

const CreateUserUseCase = require("../../domain/usecases/create-user-usecase");
const LoadUserByEmailRepository = require("../../infra/repositories/load-user-by-email-repository");
const InsertUserRepository = require("../../infra/repositories/insert-user-repository");
const Encrypter = require("../../utils/encrypter");

const SendOTPEmailVerification = require("../../domain/usecases/send-otp-email-verification");
const InsertOTPRegister = require("../../infra/repositories/insert-otp-registery-repository");
const DeleteOTPRegister = require("../../infra/repositories/delete-otp-register-by-user-id-repository");
const EmailManager = require("../../utils/email-manager");

module.exports = class CreateUserRouterComposer {
  static compose() {
    const emailValidator = new EmailValidator();

    const loadUserByEmailRepository = new LoadUserByEmailRepository();
    const insertUserRepository = new InsertUserRepository();
    const encrypter = new Encrypter();
    const createUserUseCase = new CreateUserUseCase({
      loadUserByEmailRepository,
      insertUserRepository,
      encrypter,
    });

    const insertOTPRegister = new InsertOTPRegister();
    const deleteOTPRegister = new DeleteOTPRegister();
    const emailManager = new EmailManager();
    const sendOTPEmailVerification = new SendOTPEmailVerification({
      encrypter,
      insertOTPRegister,
      deleteOTPRegister,
      emailManager,
    });

    const createUserRouter = new CreateUserRouter({
      emailValidator,
      createUserUseCase,
      sendOTPEmailVerification,
    });
    return createUserRouter;
  }
};
