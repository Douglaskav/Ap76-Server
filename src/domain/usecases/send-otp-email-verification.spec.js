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
};

const makeInsertOTPRegister = () => {
	class InsertOTPRegisterSpy {
		async insert({ userId, otp, createdAt, expiresIn }) {
			return { insertedId: this.insertedId };
		}
	}

	const insertOTPRegisterSpy = new InsertOTPRegisterSpy();
	insertOTPRegisterSpy.insertedId = "any_id";
	return insertOTPRegisterSpy;
};

const makeEmailManager = () => {
	class EmailManagerSpy {
		async sendMail() {
			return {
				email: "accepted",
				messageId: this.messageId,
				rejected: [],
			};
		}
	}

	const emailManagerSpy = new EmailManagerSpy();
	emailManagerSpy.messageId =
		"<b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>";
	return emailManagerSpy;
};

const makeSut = () => {
	const encrypterSpy = makeEncrypter();
	const insertOTPRegisterSpy = makeInsertOTPRegister();
	const emailManagerSpy = makeEmailManager();
	const sut = new SendOTPEmailVerification({
		encrypter: encrypterSpy,
		insertOTPRegister: insertOTPRegisterSpy,
		emailManager: emailManagerSpy,
	});
	return { sut, encrypterSpy, insertOTPRegisterSpy, emailManagerSpy };
};

const defaultMockUser = { userId: "any_id", email: "any_mail@mail.com" };

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
	});

	it("Should return 500 if not was possible to send the email", async () => {
		const { sut, emailManagerSpy } = makeSut();
		emailManagerSpy.messageId = null;
		const promise = await sut.sendEmailVerification(defaultMockUser);
		expect(promise.statusCode).toBe(500);
	});

	it("Should return 200 if occured everything ok", async () => {
		const { sut } = makeSut();
		const emailSent = await sut.sendEmailVerification(defaultMockUser);
		expect(emailSent.statusCode).toBe(200);
	});
});
