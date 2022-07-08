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

const makeInsertUserRepository = () => {
	class InsertUserRepositorySpy {
		async insert(user) {
			return { insertedId: this.insertedId };
		}
	}

	const insertUserRepositorySpy = new InsertUserRepositorySpy();
	insertUserRepositorySpy.insertedId = "any_id";
	return insertUserRepositorySpy;
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
	const insertUserRepositorySpy = makeInsertUserRepository();
	const encrypterSpy = makeEncrypter();

	const sut = new CreateUserUseCase({
		loadUserByEmailRepository: loadUserByEmailRepositorySpy,
		insertUserRepository: insertUserRepositorySpy,
		encrypter: encrypterSpy,
	});

	return {
		sut,
		loadUserByEmailRepositorySpy,
		insertUserRepositorySpy,
		encrypterSpy,
	};
};

describe("CreateUser UseCase", () => {
	let defaultMockUser = {
			email: "any_email@mail.com",
			username: "any_username",
			password: "any_password",
		};


	it("Should return an error with statusCode 400 if are missing param", () => {
		const { sut } = makeSut();
		const cases = [
			{ email: "", username: "test", password: "123" },
			{ email: "any_email@mail.com", username: "", password: "123" },
			{ email: "any_email@mail.com", username: "", password: "" },
			{ email: "any_email@mail.com", username: "test", password: "" },
			{ email: "any_email@mail.com", username: "", password: "123" },
			{ email: "", username: "test", password: "123" },
			{ email: "", username: "", password: "" },
		];

		for (const mock in cases) {
			const promise = sut.create(cases[mock]);
			expect(promise).rejects.toThrow();
		}
	});

	it("Should return an 409 error if an user already exists", async () => {
		const { sut, loadUserByEmailRepositorySpy } = makeSut();
		loadUserByEmailRepositorySpy.user = { email: "any_email@mail.com" };
		const user = await sut.create(defaultMockUser);
		expect(user.statusCode).toBe(409);
		expect(user.body.error).toBe("Already existe an user with this email.");
	});

	it("Should ensure that the password was been encrypted", async () => {
		const { sut, encrypterSpy } = makeSut();
		encrypterSpy.hashedValue = "";
		const user = await sut.create(defaultMockUser);
		expect(user.statusCode).toBe(500);
		expect(user.body.error).toBe("Not was possible encrypted the password");
	});

	it("Should throw if the InsertUserRepository not return the insertedId", async () => {
		const { sut, insertUserRepositorySpy } = makeSut();
		insertUserRepositorySpy.insertedId = "";
		const promise = sut.create(defaultMockUser);
		expect(promise).rejects.toThrow("An insertedId was not returned");
	});

	it("Should return 200 if the CreateUserUseCase was called with correct params", async () => {
		const { sut } = makeSut();
		const user = await sut.create(defaultMockUser);
		expect(user.statusCode).toBe(200);
	});
});
