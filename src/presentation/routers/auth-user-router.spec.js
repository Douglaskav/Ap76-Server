const AuthUserRouter = require("./auth-user-router");

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

const makeLoadOTPRegisterByEmail = () => {
	class LoadOTPRegisterByEmailSpy {
		async load() {
			return this.OTPRegister;
		}
	}

	const loadOTPRegisterByEmailSpy = new LoadOTPRegisterByEmailSpy();
	loadOTPRegisterByEmailSpy.OTPRegister = null;
	return loadOTPRegisterByEmailSpy;
};

const makeAuthUseCase = () => {
	class AuthUseCaseSpy {
		async auth(email, password) {
			this.email = email;
			this.password = password;

			return this.accessToken;
		}
	}

	const authUseCaseSpy = new AuthUseCaseSpy();
	authUseCaseSpy.accessToken = "any_token";
	return authUseCaseSpy;
};

const makeSut = () => {
	const emailValidatorSpy = makeEmailValidator();
	const loadOTPRegisterByEmailSpy = makeLoadOTPRegisterByEmail();
	const authUseCaseSpy = makeAuthUseCase();

	const sut = new AuthUserRouter({
		emailValidator: emailValidatorSpy,
		loadOTPRegisterByEmail: loadOTPRegisterByEmailSpy,
		authUseCase: authUseCaseSpy,
	});

	return { sut, emailValidatorSpy, loadOTPRegisterByEmailSpy, authUseCaseSpy };
};

describe("AuthUserRouter", () => {
	it("Should return 400 if invalid params are provided", async () => {
		const { sut } = makeSut();
		const cases = [
			{ body: { email: "any_email@mail.com" } },
			{ body: { password: "any_password" } },
		];
		for (let index in cases) {
			const httpResponse = await sut.handle(cases[index]);
			expect(httpResponse.statusCode).toBe(400);
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

	it("Should call AuthUseCaseSpy with correct params", async () => {
		const { sut, authUseCaseSpy } = makeSut();
		const httpRequest = {
			body: {
				email: "valid_email@mail.com",
				password: "any_password",
			},
		};

		await sut.handle(httpRequest);
		expect(authUseCaseSpy.email).toBe(httpRequest.body.email);
	});

	it("Should return 401 if the user not checked your otpCode", async () => {
		const { sut, loadOTPRegisterByEmailSpy } = makeSut();
		loadOTPRegisterByEmailSpy.OTPRegister = [
			{ email: "any_email@mail.com", otp: "hashedOTP" },
		];

		const httpRequest = {
			body: { email: "any_email@mail.com", password: "any_password" },
		};
		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(401);
	});

	it("Should return 401 if the email or password provided are incorrect", async () => {
		const { sut, authUseCaseSpy } = makeSut();
		authUseCaseSpy.accessToken = null;
		const httpRequest = {
			body: {
				email: "wrong_email@mail.com",
				password: "wrong_password",
			},
		};

		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(401);
	});

	it("Should return 200 and the accessToken if the credentials are correct", async () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				email: "registery_user@mail.com",
				password: "any_password",
			},
		};

		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(200);
		expect(httpResponse.body).toHaveProperty("accessToken");
	});
});
