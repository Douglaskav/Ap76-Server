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
	insertOTPRegisterSpy.insertedId = "any_userId";
	return insertOTPRegisterSpy;
};

const makeDeleteOTPRegister = () => {
	class DeleteOTPRegisterySpy {
		async deleteMany(userId) {
			return { deletedCount: this.deletedMany };
		}
	}

	const deleteOTPRegisterySpy = new DeleteOTPRegisterySpy();
	deleteOTPRegisterySpy.deletedMany = 1;
	return deleteOTPRegisterySpy;
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
	const deleteOTPRegisterSpy = makeDeleteOTPRegister();
	const emailManagerSpy = makeEmailManager();
	const sut = new SendOTPEmailVerification({
		encrypter: encrypterSpy,
		insertOTPRegister: insertOTPRegisterSpy,
		deleteOTPRegister: deleteOTPRegisterSpy,
		emailManager: emailManagerSpy,
	});
	return {
		sut,
		encrypterSpy,
		insertOTPRegisterSpy,
		deleteOTPRegisterSpy,
		emailManagerSpy,
	};
};

describe("SendOTPEmailVerification", () => {
	it("Should return an error 400 if the params are not provided correctly", async () => {
		const { sut } = makeSut();
		const httpResponse = await sut.sendEmailVerification("");
		expect(httpResponse.body.error).toBe("Missing params");
		expect(httpResponse.statusCode).toBe(400);
	});

	it("Should return an error 500 if was't possible encrypt the OTP Code", async () => {
		const { sut, encrypterSpy } = makeSut();
		encrypterSpy.hash = null;
		const httpResponse = await sut.sendEmailVerification("valid_email@mail.com");
		expect(httpResponse.statusCode).toBe(500);
	});

	it("Should return 500 if not was possible to send the email", async () => {
		const { sut, emailManagerSpy } = makeSut();
		emailManagerSpy.messageId = null;
		const promise = await sut.sendEmailVerification("valid_email@mail.com");
		expect(promise.statusCode).toBe(500);
	});

	it("Should return the emailSent and otp code if occured everything ok", async () => {
		const { sut } = makeSut();
		const emailSent = await sut.sendEmailVerification("valid_email@mail.com");
		expect(emailSent).toHaveProperty("sentEmail");
		expect(emailSent).toHaveProperty("otp");
	});
});
