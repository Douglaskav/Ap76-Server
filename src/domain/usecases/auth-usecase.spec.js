const AuthUseCase = require("./auth-usecase");

const makeLoadUserByEmailRepository = () => {
	class LoadUserByEmailRepositorySpy {
		async load(email) {
			this.email = email;
			return this.user;
		}
	}

	const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();
	loadUserByEmailRepositorySpy.user = {
		id: "any_id",
		password: "hashed_password",
	};
	return loadUserByEmailRepositorySpy;
};

const makeLoadOTPRegisterByEmail = () => {
	class LoadOTPRegisterByEmailSpy {
		async load() {
			return this.OTPRegister;
		}
	}

	const loadOTPRegisterByEmailSpy = new LoadOTPRegisterByEmailSpy();
	loadOTPRegisterByEmailSpy.OTPRegister = [
		{
			email: "any_email@mail.com",
			otp: "hashedOTP",
			createdAt: Date.now(),
			expiresIn: Date.now() + 3600000,
			length: 1,
		},
	];
	return loadOTPRegisterByEmailSpy;
};

const makeTokenGenerator = () => {
	class TokenGenerator {
		async generate(userId) {
			this.userId = userId;
			return this.accessToken;
		}
	}

	const tokenGeneratorSpy = new TokenGenerator();
	tokenGeneratorSpy.accessToken = "any_token";
	return tokenGeneratorSpy;
};

const makeEncrypter = () => {
	class EncrypterSpy {
		async compare(value, hash) {
			this.value = value;
			this.hash = hash;
			return this.isValid;
		}
	}

	const encrypterSpy = new EncrypterSpy();
	encrypterSpy.isValid = true;
	return encrypterSpy;
};

const makeSut = () => {
	const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository();
	const loadOTPRegisterByEmailSpy = makeLoadOTPRegisterByEmail();
	const tokenGeneratorSpy = makeTokenGenerator();
	const encrypterSpy = makeEncrypter();

	const sut = new AuthUseCase({
		loadUserByEmailRepository: loadUserByEmailRepositorySpy,
		loadOTPRegisterByEmail: loadOTPRegisterByEmailSpy,
		tokenGenerator: tokenGeneratorSpy,
		encrypter: encrypterSpy,
	});
	return {
		sut,
		loadUserByEmailRepositorySpy,
		loadOTPRegisterByEmailSpy,
		tokenGeneratorSpy,
		encrypterSpy,
	};
};

describe("AuthUseCase", () => {
	it("Should return an error if an email is not provided", () => {
		const { sut } = makeSut();
		const promise = sut.auth("", "any_password");
		expect(promise).rejects.toThrow("Missing param email");
	});

	it("Should return an error if an password is not provided", () => {
		const { sut } = makeSut();
		const promise = sut.auth("any_email@mail.com", "");
		expect(promise).rejects.toThrow("Missing param password");
	});

	it("Should call AuthUseCase with the correct credentials", async () => {
		const { sut, loadUserByEmailRepositorySpy } = makeSut();
		await sut.auth("any_email@mail.com", "any_password");
		expect(loadUserByEmailRepositorySpy.email).toBe("any_email@mail.com");
	});

	it("Should call AuthUseCase with the wrong credentials", async () => {
		const { sut, loadUserByEmailRepositorySpy } = makeSut();
		loadUserByEmailRepositorySpy.user = null;
		const accessToken = await sut.auth(
			"invalid_email@mail.com",
			"invalid_password"
		);
		expect(accessToken.error).toBe("email or password incorrect");
	});
});
