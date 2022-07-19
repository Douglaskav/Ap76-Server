jest.mock("nodemailer", () => ({
  createTransport() {
    return {
      sendMail: () => {
        return {email: 'accepted', rejected: []}
      }
    };
  },
}));

const EmailManager = require("./email-manager");

const makeSut = () => {
  return new EmailManager();
};

describe("EmailManager", () => {
  test("Should throw if EmailManager.sendMail() is called without mailOptions", () => {
    const sut = makeSut();
    const cases = [
      {
        from: "",
        to: "valid_email@mail.com",
        subject: "Verify your email",
        html: `<p>Enter <b> 123456</b> in the app to verify your email address and complete the sign `,
      },
      {
        from: "admin@mail.com",
        to: "",
        subject: "Verify your email",
        html: `<p>Enter <b>123456</b> in the app to verify your email address and complete the sign `,
      },
      {
        from: "admin_email@mail.com",
        to: "valid_email@mail.com",
        subject: "",
        html: `<p>Enter <b>123456</b> in the app to verify your email address and complete the sign `,
      },
      {
        from: "admin_email@mail.com",
        to: "valid_email@mail.com",
        subject: "Verify your email",
        html: "",
      },
      {
        from: "",
        to: "valid_email@mail.com",
        subject: "Verify your email",
        html: `<p>Enter <b> 123456</b> in the app to verify your email address and complete the sign `,
      },
    ];

    for (const index in cases) {
      const promise = sut.sendMail(cases[index]);
      expect(promise).rejects.toThrow();
    }
  });

  it("Should return 200 if everything occured ok", async () => {
    const sut = makeSut();
    const emailSent = await sut.sendMail({
      from: "admin@mail.com",
      to: "valid_email@mail.com",
      subject: "Verify your email",
      html: `<p>Enter <b> 123456</b> in the app to verify your email address`,
    });

    expect(emailSent.rejected).toStrictEqual([]);
  });
});
