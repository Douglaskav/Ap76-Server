const VerifyOTPCodeRouter = require("./verify-otp-code-router");

const makeVerifyOTPCode = () => {
	class VerifyOTPCodeSpy {
		async verify() {
			return this.isValidOTP;
		}
	}

	const verifyOTPCodeSpy = new VerifyOTPCodeSpy();
	verifyOTPCodeSpy.isValidOTP = true;
	return verifyOTPCodeSpy;
};

const makeSut = () => {
	const verifyOTPCodeSpy = makeVerifyOTPCode();
	const sut = new VerifyOTPCodeRouter({ verifyOTPCode: verifyOTPCodeSpy });
	return { sut, verifyOTPCodeSpy };
};

describe("VerifyOTPCodeRouter", () => {
	it("Should throw if the VerifyOTPCodeRouter was called with invalid params", async () => {
		const { sut } = makeSut();
		const httpRequest = null;
		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(500);
	});

	it("Should return an unauthorizedError if not was possible check the code", async () => {
		const { sut, verifyOTPCodeSpy } = makeSut();
		verifyOTPCodeSpy.isValidOTP = null;

		const httpRequest = {
			body: { email: "any_email@mail.com", otp: "any_otp" },
		};
		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(401);
	});

	it("Should verify the user without errors", async () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: { email: "any_email@mail.com", otp: "any_otp" },
		};

		const httpResponse = await sut.handle(httpRequest);

		expect(httpResponse.body).toHaveProperty("email");
		expect(httpResponse.body).toHaveProperty("verifiedUser");
	});
});
