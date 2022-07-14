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
			return { insertedId: this.insertedId };
		}
	}

	const createUserUseCase = new CreateUserUseCaseSpy();
	createUserUseCase.insertedId = "any_id";
	return createUserUseCase;
};

const makeSendOTPEmailVerification = () => {
	class SendOTPEmailVerificationSpy {
		async sendEmailVerification({ _id, email }) {
			if (!this.messageId) return null;

			return {
				sentEmail: {
					email: "accepted",
					messageId: this.messageId,
					rejected: [],
				},
			};
		}
	}

	const sendOTPEmailVerification = new SendOTPEmailVerificationSpy();
	sendOTPEmailVerification.messageId =
		"<b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>";
	return sendOTPEmailVerification;
};

const makeSut = () => {
	const emailValidatorSpy = makeEmailValidator();
	const createUserUseCaseSpy = makeCreateUserUseCase();
	const sendOTPEmailVerificationSpy = makeSendOTPEmailVerification();

	const sut = new CreateUserRouter({
		emailValidator: emailValidatorSpy,
		createUserUseCase: createUserUseCaseSpy,
		sendOTPEmailVerification: sendOTPEmailVerificationSpy,
	});

	return {
		sut,
		emailValidatorSpy,
		createUserUseCaseSpy,
		sendOTPEmailVerificationSpy,
	};
};

const defaultMockHttpRequest = {
	body: {
		username: "any_username",
		email: "any_email",
		password: "any_password",
	},
};

describe("CreateUserRouter", () => {
	it("Should return 400 if the params are not provided correctly", async () => {
		const { sut } = makeSut();
		const cases = [
			{ body: { password: "any_password", username: "any_username" } },
			{ body: { email: "any_email", username: "any_username" } },
			{ body: { email: "any_email", password: "any_password" } },
		];

		for (const index in cases) {
			const httpResponse = await sut.handle(cases[index]);
			expect(httpResponse.statusCode).toBe(400);
			expect(httpResponse.body.error).toBe("Missing param");
		}
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

	it("Should throw if not was possible to create a new user", async () => {
		const { sut, createUserUseCaseSpy } = makeSut();
		createUserUseCaseSpy.insertedId = null;
		const httpResponse = await sut.handle(defaultMockHttpRequest);
		expect(httpResponse.statusCode).toBe(500);
	});

	it("Should throw if not was possible to send the email", async () => {
		const { sut, sendOTPEmailVerificationSpy } = makeSut();
		sendOTPEmailVerificationSpy.messageId = null;
		const httpResponse = await sut.handle(defaultMockHttpRequest);
		expect(httpResponse.statusCode).toBe(500);
	});

	it("Should return 200 if the user was been created without errors", async () => {
		const { sut } = makeSut();
		const httpResponse = await sut.handle(defaultMockHttpRequest);
		expect(httpResponse.statusCode).toBe(200);
		expect(httpResponse.body.sentEmail).toHaveProperty("messageId");
	});
});
