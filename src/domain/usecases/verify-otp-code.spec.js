const VerifyOTPCode = require("./verify-otp-code");

const makeLoadUserByEmailRepository = () => {
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
	const loadOTPRegisterByEmailSpy = makeLoadUserByEmailRepository();
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

	it("Should throw if loadOTPRegisterByEmailSpy don't found any register", async () => {
		const { sut, loadOTPRegisterByEmailSpy } = makeSut();
		loadOTPRegisterByEmailSpy.OTPRegister = { length: 0 };
		const promise = sut.verify(defaultMockValues);
		expect(promise).rejects.toThrow(
			"Not was found an OTPRegistry for this user."
		);
	});

	it("Should return an unauthorizedError if the OTPCode was been expired", async () => {
		const { sut, loadOTPRegisterByEmailSpy } = makeSut();
		loadOTPRegisterByEmailSpy.OTPRegister.expiresIn = Date.now() - 3600000;
		const codeIsValid = await sut.verify(defaultMockValues);
		expect(codeIsValid.statusCode).toBe(401);
		expect(codeIsValid.body.error).toBe("Code has expired. Please request another");
	});

	it("Should return an unauthorizedError if the OTPCode is invalid", async () => {
		const { sut, encrypterSpy } = makeSut();
		encrypterSpy.isValid = false;
		const isValid = await sut.verify(defaultMockValues);
		expect(isValid.statusCode).toBe(401);
	});

	it("Should return the isValidOTP boolean if the code provided is valid", async () => {
		const { sut } = makeSut();
		const codeIsValid = await sut.verify(defaultMockValues);
		expect(codeIsValid).toHaveProperty("isValidOTP");
	});
});
