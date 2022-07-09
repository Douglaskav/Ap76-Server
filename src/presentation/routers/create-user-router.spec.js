const CreateUserRouter = require("./create-user-router");

// make the makeEmailValidatorSpy
const makeEmailValidator = () => {
	class EmailValidatorSpy {
		isValid(email) {
			this.email = email;
			return this.isEmailValid;
		}
	}

	const emailValidatorSpy = new EmailValidatorSpy();
	emailValidatorSpy.isEmailValid = true;
	return emailValidatorSpy;
};

const makeCreateUserUseCase = () => {
	class CreateUserUseCaseSpy {
		async create() {
			return this.user;
		}
	}

	const createUserUseCase = new CreateUserUseCaseSpy();
	createUserUseCase.user = {
		username: "any_username",
		email: "any_email",
		password: "any_password",
	};
	return createUserUseCase;
};

const makeSut = () => {
	const emailValidatorSpy = makeEmailValidator();
	const createUserUseCaseSpy = makeCreateUserUseCase();

	const sut = new CreateUserRouter({
		emailValidator: emailValidatorSpy,
		createUserUseCase: createUserUseCaseSpy,
	});

	return { sut, emailValidatorSpy, createUserUseCaseSpy };
};

describe("CreateUserRouter", () => {
	it("Should return 400 if no email is provided", async () => {
		const { sut } = makeSut();
		const httpRequest = { body: { password: "any_password" } };
		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
	});

	it("Should return 400 if no password is provided", async () => {
		const { sut } = makeSut();
		const httpRequest = { body: { email: "any_email@mail.com" } };
		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
	});

	it("Should return 400 if no username is provided", async () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: { email: "any_email@mail.com", password: "any_password" },
		};
		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
	});

	it("Should return 400 if an invalid email is provided", async () => {
		const { sut, emailValidatorSpy } = makeSut();
		emailValidatorSpy.isEmailValid = false;
		const httpRequest = {
			body: { email: "invalid_mail@mail.com", password: "any_password" },
		};
		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
	});

	it("Should return 500 if no httpRequest is provided", async () => {
		const { sut } = makeSut();
		const httpResponse = await sut.handle();
		expect(httpResponse.statusCode).toBe(500);
	});

	it("Should return 500 if the httpRequest doesn't have a body", async () => {
		const { sut } = makeSut();
		const httpRequest = {};
		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(500);
	});

	it.todo(
		"should throw if createUserUseCase.create() is called with invalid params."
	);

	it("Should throw if not was possible to create a new user", async () => {
		const { sut, createUserUseCaseSpy } = makeSut();
		createUserUseCaseSpy.user = null;
		const httpRequest = {
			body: {
				username: "any_username",
				email: "any_email",
				password: "any_password",
			},
		};
		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(500);
	});
});
