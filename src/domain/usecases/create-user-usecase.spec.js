const CreateUserUseCase = require("./create-user-usecase");

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
	const insertUserRepositorySpy = makeInsertUserRepository();
	const encrypterSpy = makeEncrypter();

	const sut = new CreateUserUseCase({
		insertUserRepository: insertUserRepositorySpy,
		encrypter: encrypterSpy,
	});

	return {
		sut,
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


	it("Should throw if CreateUserUseCase is called missing params", () => {
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

	it("Should ensure that the password was been encrypted", () => {
		const { sut, encrypterSpy } = makeSut();
		encrypterSpy.hashedValue = "";
		const promise = sut.create(defaultMockUser);
		expect(promise).rejects.toThrow("Not was possible encrypted the password");
	});

	it("Should throw if the InsertUserRepository not return the insertedId", () => {
		const { sut, insertUserRepositorySpy } = makeSut();
		insertUserRepositorySpy.insertedId = "";
		const promise = sut.create(defaultMockUser);
		expect(promise).rejects.toThrow("An insertedId was not returned");
	});

	it("Should return a new user if the CreateUserUseCase was called with correct params", async () => {
		const { sut } = makeSut();
		const user = await sut.create(defaultMockUser);
		expect(user).toHaveProperty("insertedId");
	});
});
