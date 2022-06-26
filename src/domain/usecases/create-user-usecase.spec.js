const CreateUserUseCase = require("./create-user-usecase");

const makeLoadUserByEmailRepository = () => {
	class LoadUserByEmailRepositorySpy {
		async load(email) {
			this.email = email;
			if (this.user && this.email === this.user.email) return this.user;
		}
	}

	const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();
	return loadUserByEmailRepositorySpy;
};

const makeEncrypter = () => {
	class EncrypterSpy {
		async generateHash(password, saltRound) {
			return this.hashedValue;
		}
	}

	const encrypterSpy = new EncrypterSpy();
	encrypterSpy.hashedValue = "any_hash";
	return encrypterSpy;
};

const makeSut = () => {
	const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository();
	const encrypterSpy = makeEncrypter();
	const sut = new CreateUserUseCase({
		loadUserByEmailRepository: loadUserByEmailRepositorySpy,
		encrypter: encrypterSpy,
	});
	return { sut, loadUserByEmailRepositorySpy, encrypterSpy };
};

describe("CreateUser UseCase", () => {
	it("Should return an error with statusCode 400 if are missing param", () => {
		const { sut } = makeSut();
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

	it("Should return an 409 error if an user already exists", async () => {
		const { sut, loadUserByEmailRepositorySpy } = makeSut();
		const mockUser = {
			email: "any_email@mail.com",
			username: "any_username",
			password: "any_password",
		};
		loadUserByEmailRepositorySpy.user = { email: "any_email@mail.com" };
		const user = await sut.create(mockUser);
		expect(user.statusCode).toBe(409);
		expect(user.body).toBe("Already existe an user with this email.");
	});

	it("Should ensure that the password was been encrypted", async () => {
		const { sut, encrypterSpy } = makeSut();
		const mockUser = {
			email: "any_email@mail.com",
			username: "any_username",
			password: "any_password",
		};

		encrypterSpy.hashedValue = "";
		const user = await sut.create(mockUser);
		expect(user.statusCode).toBe(500);
		expect(user.body).toBe("Not was possible encrypted the password");
	});

	it("Should return 200 if the CreateUserUseCase was called with correct params", async () => {
		const { sut } = makeSut();
		const mockUser = {
			email: "any_email@mail.com",
			username: "any_username",
			password: "any_password",
		};
		const user = await sut.create(mockUser);
		expect(user.statusCode).toBe(200);
	});
});
