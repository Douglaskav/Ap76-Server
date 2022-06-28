class SendOTPEmailVerification {
	contructor() {

	}

	async sendEmailVerification({userId, email}) {
		if (!userId || !email) throw new Error("You must pass an userId and an email.");
	}
}

const makeSut = () => {
	return new SendOTPEmailVerification();
}

describe("SendOTPEmailVerification", () => {
	it("Should throw if the params are not provided correctly", () => {
		const sut = makeSut();
		const promise = sut.sendEmailVerification({});
		expect(promise).rejects.toThrow();	
	});	
});
