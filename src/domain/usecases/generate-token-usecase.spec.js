const HttpResponseErrors = require("../../utils/http-response-errors");

class TokenGenerator {
	generateToken(email, password) {
		if (!email) return HttpResponseErrors.badRequest("Missing param email");
		if (!password) return HttpResponseErrors.badRequest("Missing param password");
		
	}
}

const makeSut = () => {
	const sut = new TokenGenerator();
	return { sut };
};

describe("Generate Token UseCase", () => {
	test("Should return an error if an email is not provided", () => {
		const { sut } = makeSut();
		const httpResponse = sut.generateToken("", "any_password");

		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toBe("Missing param email");
	});

	test("Should return an error if an password is not provided", () => {
		const { sut } = makeSut();
		const httpResponse = sut.generateToken("any_email@mail.com", "");

		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toBe("Missing param password");
	});
});
