const VerifyOTPCode = require("./verify-otp-code");

const makeFindOTPRegisterByUserId = () => {
	class FindOTPRegisterByUserIdSpy {
		async find() {
			return this.OTPRegister;
		}
	}

	const findOTPRegisterByUserIdSpy = new FindOTPRegisterByUserIdSpy();
	findOTPRegisterByUserIdSpy.OTPRegister = [{
		userId: "any_userId",
		otp: "hashedOTP",
		createdAt: Date.now(),
		expiresIn: Date.now() + 3600000,
		length: 1,
	}];
	return findOTPRegisterByUserIdSpy;
};

const makeDeleteOTPRegisterByUserId = () => {
	class DeleteOTPRegisteryByUserId {
		async deleteMany() {
			return this.deletedId;
		}
	}

	const deleteOTPRegisterByUserId = new DeleteOTPRegisteryByUserId();
	deleteOTPRegisterByUserId.deletedId = "any_otp_id";
	return deleteOTPRegisterByUserId;
};

const makeSut = () => {
	const findOTPRegisterByUserIdSpy = makeFindOTPRegisterByUserId();
	const deleteOTPRegisterByUserIdSpy = makeDeleteOTPRegisterByUserId();
	const sut = new VerifyOTPCode({
		findOTPRegisterByUserId: findOTPRegisterByUserIdSpy,
		deleteOTPRegisterByUserId: deleteOTPRegisterByUserIdSpy,
	});
	return { sut, findOTPRegisterByUserIdSpy, deleteOTPRegisterByUserIdSpy };
};

const defaultMockValues = { userId: "any_id", otp: 999999 };

describe("VerifyOTPCode", () => {
	it("should throw if userId or otp_code are not provided", () => {
		const { sut } = makeSut();
		const cases = [
			{},
			{ userId: "", otp: "999999" },
			{ userId: "any_userId", otp: "" },
		];

		for (const index in cases) {
			const promise = sut.verifyCode(cases[index]);
			expect(promise).rejects.toThrow("userId and OTP_code should be provided");
		}
	});

	it("Should throw if findOTPRegisterByUserIdSpy don't found any register", async () => {
		const { sut, findOTPRegisterByUserIdSpy } = makeSut();
		findOTPRegisterByUserIdSpy.OTPRegister = { length: 0 };
		const promise = sut.verifyCode(defaultMockValues);
		expect(promise).rejects.toThrow(
			"Not was found an OTPRegistry for this user."
		);
	});

	it("Should return an unauthorizedError if the OTPCode was been expired", async () => {
		const{ sut, findOTPRegisterByUserIdSpy} = makeSut();
		findOTPRegisterByUserIdSpy.OTPRegister[0].expiresIn = Date.now() - 3600000;
		const codeIsValid = await sut.verifyCode(defaultMockValues);
		expect(codeIsValid.statusCode).toBe(401);
		expect(codeIsValid.body).toBe("Code has expired. Please request another");
	})

	it("Should should return if the code provided is valid", async () => {
		const { sut } = makeSut();
		const codeIsValid = await sut.verifyCode(defaultMockValues);
		expect(codeIsValid.isValid).toBeTruthy();
		expect(codeIsValid.statusCode).toBe(200);
	});
});
