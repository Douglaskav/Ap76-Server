const HttpResponseErrors = require("../../utils/http-response-errors");

class AuthUseCase {
	constructor({ loadUserByEmailRepository } = {}) {
		this.loadUserByEmailRepository = loadUserByEmailRepository;
	}

	async auth(email, password) {
		if (!email) return HttpResponseErrors.badRequest("Missing param email");
		if (!password)
			return HttpResponseErrors.badRequest("Missing param password");

		const user = await this.loadUserByEmailRepository.load(email);
	}
}

const makeSut = () => {
	const sut = new AuthUseCase();
	return { sut };
};

describe("AuthUseCase", () => {
	it("Should return an error if an email is not provided", async () => {
		const { sut } = makeSut();
		const httpResponse = await sut.auth("", "any_password");

		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toBe("Missing param email");
	});

	it("Should return an error if an password is not provided", async () => {
		const { sut } = makeSut();
		const httpResponse = await sut.auth("any_email@mail.com", "");

		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toBe("Missing param password");
	});
});
