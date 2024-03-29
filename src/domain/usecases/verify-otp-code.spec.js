const VerifyOTPCode = require("./verify-otp-code");

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
		},
	];
	return loadOTPRegisterByEmailSpy;
};

const makeDeleteOTPRegisterByEmail = () => {
	class DeleteOTPRegisteryByEmailSpy {
		async deleteMany() {
			return this.deletedId;
		}
	}

	const deleteOTPRegisteryByEmailSpy = new DeleteOTPRegisteryByEmailSpy();
	deleteOTPRegisteryByEmailSpy.deletedId = "any_otp_id";
	return deleteOTPRegisteryByEmailSpy;
};

const makeInsertVerifyToUser = () => {
	class InsertVerifyToUserSpy {
		async verify() {
			return this.isVerify;
		}
	}

	const insertVerifyToUserSpy = new InsertVerifyToUserSpy();
	insertVerifyToUserSpy.isVerify = true;
	return insertVerifyToUserSpy;
};

const makeEncrypter = () => {
	class EncrypterSpy {
		compare() {
			return this.isValid;
		}
	}

	const encrypterSpy = new EncrypterSpy();
	encrypterSpy.isValid = true;
	return encrypterSpy;
};

const makeSut = () => {
	const loadOTPRegisterByEmailSpy = makeLoadOTPRegisterByEmail();
	const deleteOTPRegisterByEmailSpy = makeDeleteOTPRegisterByEmail();
	const insertVerifyToUserSpy = makeInsertVerifyToUser();
	const encrypterSpy = makeEncrypter();

	const sut = new VerifyOTPCode({
		loadOTPRegisterByEmail: loadOTPRegisterByEmailSpy,
		deleteOTPRegisterByEmail: deleteOTPRegisterByEmailSpy,
		insertVerifyToUser: insertVerifyToUserSpy,
		encrypter: encrypterSpy,
	});
	return {
		sut,
		loadOTPRegisterByEmailSpy,
		deleteOTPRegisterByEmailSpy,
		insertVerifyToUserSpy,
		encrypterSpy,
	};
};

const defaultMockValues = { email: "any_email@mail.com", otp: 999999 };

describe("VerifyOTPCode", () => {
	it("should throw if email or otp_code are not provided", () => {
		const { sut } = makeSut();
		const cases = [
			{},
			{ email: "", otp: "999999" },
			{ email: "any_userId", otp: "" },
		];

		for (const index in cases) {
			const promise = sut.verify(cases[index]);
			expect(promise).rejects.toThrow("email and OTP_code should be provided");
		}
	});

	it("Should return null if loadOTPRegisterByEmailSpy don't found any register", async () => {
		const { sut, loadOTPRegisterByEmailSpy } = makeSut();
		loadOTPRegisterByEmailSpy.OTPRegister = null;
		const httpResponse = await sut.verify(defaultMockValues);
		expect(httpResponse).toBeNull();
	});

	it("Should return an unauthorizedError if the OTPCode was been expired", async () => {
		const { sut, loadOTPRegisterByEmailSpy } = makeSut();
		loadOTPRegisterByEmailSpy.OTPRegister.expiresIn = Date.now() - 3600000;
		const httpResponse = await sut.verify(defaultMockValues);
		expect(httpResponse).toBeNull();
	});

	it("Should return an unauthorizedError if the OTPCode is wrong", async () => {
		const { sut, encrypterSpy } = makeSut();
		encrypterSpy.isValid = false;
		const isValidOTP = await sut.verify(defaultMockValues);
		expect(isValidOTP).toBeNull();
	});

	it("Should return the isValidOTP boolean if the code provided is valid", async () => {
		const { sut } = makeSut();
		const httpResponse = await sut.verify(defaultMockValues);
		expect(httpResponse).toBeTruthy();
	});
});
