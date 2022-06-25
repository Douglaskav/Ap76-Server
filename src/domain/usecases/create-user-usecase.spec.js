const CreateUserUseCase = require("./create-user-usecase");

const makeSut = () => {
	return new CreateUserUseCase();
};

describe("CreateUser UseCase", () => {
	it("Should return an error with statusCode 400 if are missing param", () => {
		const sut = makeSut();
		const cases = [].concat(
			{ email: "", username: "test", password: "123" },
			{ email: "any_email@mail.com", username: "", password: "123" },
			{ email: "any_email@mail.com", username: "", password: "" },
			{ email: "any_email@mail.com", username: "test", password: "" },
			{ email: "any_email@mail.com", username: "", password: "123" },
			{ email: "", username: "test", password: "123" },
			{ email: "", username: "", password: "" }
		);

		for (const mock in cases) {
			const promise = sut.create(mock);
			expect(promise).rejects.toThrow();
		}
	});

	it("Should return 200 if the CreateUserUseCase was called with correct params", async () => {
		const sut = makeSut();
		const mockUser = {
			email: "any_email@mail.com",
			username: "test",
			password: "123",
		};
		const user = await sut.create(mockUser);
		expect(user.statusCode).toBe(200);
	});
});
