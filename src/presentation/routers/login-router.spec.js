const LoginRouter = require("./login-router");

class EmailValidatorSpy {
	isValid(email) {
		this.email = email;
		return this.isEmailValid;
	}
}

class tokenGeneratorSpy {
	generateToken(email, password) {
		
	}
}

const makeSut = () => {
	const emailValidatorSpy = new EmailValidatorSpy();
	const sut = new LoginRouter({ emailValidator: emailValidatorSpy });
	return { sut, emailValidatorSpy };
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

});                                                            });
