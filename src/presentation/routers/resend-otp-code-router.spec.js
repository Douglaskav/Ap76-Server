const ResendOTPCodeRouter = require("./resend-otp-code-router");

const makeSendOTPEmailVerification = () => {
	class SendOTPEmailVerificationSpy {
		async sendEmailVerification({ _id, email }) {
			if (!this.messageId) return null;

			return {
				email: "accepted",
				messageId: this.messageId,
				rejected: [],
			};
		}
	}

	const sendOTPEmailVerification = new SendOTPEmailVerificationSpy();
	sendOTPEmailVerification.messageId =
		"<b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>";
	return sendOTPEmailVerification;
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

const makeSut = () => {
	const sendOTPEmailVerificationSpy = makeSendOTPEmailVerification();
	const loadOTPRegisterByEmailSpy = makeLoadOTPRegisterByEmail();
	const sut = new ResendOTPCodeRouter({
		sendOTPEmailVerification: sendOTPEmailVerificationSpy,
		loadOTPRegisterByEmail: loadOTPRegisterByEmailSpy,
	});
	return { sut, sendOTPEmailVerificationSpy, loadOTPRegisterByEmailSpy };
};

describe("ResendOTPCodeRouter", () => {
	it("Should return 500 if no httpRequest is provided", async () => {
		const { sut } = makeSut();
		const httpResponse = await sut.handle();
		expect(httpResponse.statusCode).toBe(500);
	});

	it("Should return 500 if the httpRequest doesn't have a body", async () => {
		const { sut } = makeSut();
		const httpRequest = {};
		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(500);
	});

	it("Should return an 400 error if the params provided are invalid", async () => {
		const { sut } = makeSut();
		const httpRequest = { body: { email: "" } };
		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
	});

	it("Should return an error 401 if the OTPRegister doesn't exists", async () => {
		const { sut, loadOTPRegisterByEmailSpy } = makeSut();
		loadOTPRegisterByEmailSpy.OTPRegister = null;
		const httpRequest = { body: { email: "any_email@mail.com" } };
		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(401);
		expect(httpResponse.body.error).toBe(
			"This user it's already verified or not exists, please login or sign up."
		);
	});

	it("Should return an error 500 if was't possible send the email", async () => {
		const { sut, sendOTPEmailVerificationSpy } = makeSut();
		sendOTPEmailVerificationSpy.messageId = null;
		const httpRequest = { body: { email: "any_email@mail.com" } };
		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(500);
	});

	it("Should return 200 if the email was sent", async () => {
		const { sut } = makeSut();
		const httpRequest = { body: { email: "valid_email@mail.com" } };
		const httpResponse = await sut.handle(httpRequest);

		expect(httpResponse.statusCode).toBe(200);
		expect(httpResponse.body).toHaveProperty("messageId");
		expect(httpResponse.body).toHaveProperty("envelope");
	});
});
