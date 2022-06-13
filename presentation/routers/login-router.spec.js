const LoginRouter = require("./login-router");

const makeSut = () => {
	const sut = new LoginRouter();
	return { sut };
}

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
});
