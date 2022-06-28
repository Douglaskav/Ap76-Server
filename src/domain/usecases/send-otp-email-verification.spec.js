const SendOTPEmailVerification = require("./send-otp-email-verification");

const makeSut = () => {
	return new SendOTPEmailVerification();
};

describe("SendOTPEmailVerification", () => {
	it("Should throw if the params are not provided correctly", () => {
		const sut = makeSut();
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

	it("Should return 200 if occured everything ok", async () => {
		const sut =  makeSut();
		const emailSent = await sut.sendEmailVerification({ userId: "any_id", email: "any_mail@mail.com" });
		expect(emailSent.statusCode).toBe(200);
	});
});
