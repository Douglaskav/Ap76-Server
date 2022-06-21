const LoginRouter = require("./login-router");
const jwt = require("jsonwebtoken");

class EmailValidatorSpy {
	isValid(email) {
		this.email = email;
		return this.isEmailValid;
	}
}

class TokenGeneratorSpy {
	generateToken(email, password) {
		this.email = email;
		this.password = password;

		if (
			this.email === "registery_user@mail.com" &&
			this.password === "any_password"
		) {
			let accessToken = jwt.sign({ email, password }, "secret");
			return { accessToken, statusCode: 200 };
		}

		return null;
	}
}

const makeSut = () => {
	const emailValidatorSpy = new EmailValidatorSpy();
	const tokenGeneratorSpy = new TokenGeneratorSpy();

	emailValidatorSpy.isEmailValid = true;

	const sut = new LoginRouter({
		emailValidator: emailValidatorSpy,
		tokenGenerator: tokenGeneratorSpy,
	});

	return { sut, emailValidatorSpy, tokenGeneratorSpy };
};

describe("LoginRouter", () => {
	test("Should return 400 if no email is provided", () => {
		const { sut } = makeSut();
		const httpRequest = { body: { password: "any_password" } };
		const httpResponse = sut.auth(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
	});

	test("Should return 400 if no password is provided", () => {
		const { sut } = makeSut();
		const httpRequest = { body: { email: "any_email@mail.com" } };
		const httpResponse = sut.auth(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
	});

	test("Should return 400 if an invalid email is provided", () => {
		const { sut, emailValidatorSpy } = makeSut();
		emailValidatorSpy.isEmailValid = false;
		const httpRequest = {
			body: { email: "invalid_mail@mail.com", password: "any_password" },
		};
		const httpResponse = sut.auth(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
	});

	test("Should return 500 if no httpRequest is provided", () => {
		const { sut } = makeSut();
		const httpResponse = sut.auth();
		expect(httpResponse.statusCode).toBe(500);
	});

	test("Should return 500 if the httpRequest doesn't have a body", () => {
		const { sut } = makeSut();
		const httpRequest = {};
		const httpResponse = sut.auth(httpRequest);
		expect(httpResponse.statusCode).toBe(500);
	});

	test("Should call TokenGeneratorSpy with correct params", () => {
		const { sut, tokenGeneratorSpy } = makeSut();
		const httpRequest = {
			body: {
				email: "valid_email@mail.com",
				password: "any_password",
			},
		};

		sut.auth(httpRequest);
		expect(tokenGeneratorSpy.email).toBe(httpRequest.body.email);
	});

	test("Should return 401 if the email or password provided are invalid", () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				email: "invalid_email@mail.com",
				password: "any_password",
			},
		};

		const httpResponse = sut.auth(httpRequest);
		expect(httpResponse.statusCode).toBe(401);
	});

	test("Should return 200 and the accessToken if the credentials are correct", () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				email: "registery_user@mail.com",
				password: "any_password",
			},
		};

		const httpResponse = sut.auth(httpRequest);
		expect(httpResponse.statusCode).toBe(200);
		expect(httpResponse).toHaveProperty("accessToken");
	});
});
