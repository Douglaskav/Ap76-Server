const SendOTPEmailVerification = require("./send-otp-email-verification");

const makeEncrypter = () => {
	class EncrypterSpy {
		async generateHash(otp, SALT_ROUNDS) {
			return this.hash; 
		}
	}

	const encrypterSpy = new EncrypterSpy();
	encrypterSpy.hash = 999999;
	return encrypterSpy;
}


const makeSut = () => {
	const encrypterSpy = makeEncrypter();
	const sut = new SendOTPEmailVerification({encrypter: encrypterSpy});
	return { sut, encrypterSpy }
};

const defaultMockUser = { userId: "any_id", email: "any_mail@mail.com" }


describe("SendOTPEmailVerification", () => {
	it("Should throw if the params are not provided correctly", () => {
		const { sut } = makeSut();
		const cases = [
			{ userId: "any_id", email: "" },
			{ userId: "", email: "any_mail@mail.com" },
			{ userId: "", email: "" },
		];

		for (const index in cases) {
			const promise = sut.sendEmailVerification(cases[index]);
			expect(promise).rejects.toThrow("Missing params");
		}
	});

	it("Should throw if was not possible encrypt the OTP Code", () => {
		const { sut, encrypterSpy } = makeSut();
		encrypterSpy.hash = null;
		const promise = sut.sendEmailVerification(defaultMockUser);
		expect(promise).rejects.toThrow();	
	})

	it("Should return 200 if occured everything ok", async () => {
		const { sut } =  makeSut();
		const emailSent = await sut.sendEmailVerification(defaultMockUser);
		expect(emailSent.statusCode).toBe(200);
	});
});
