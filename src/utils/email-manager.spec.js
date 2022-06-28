require("dotenv").config();
const nodemailer = require("nodemailer");
// Success return object:
/*
  {
    accepted: [ 'dnmsmpvp@gmail.com' ],
    rejected: [],
    envelopeTime: 252,
    messageTime: 203,
    messageSize: 363,
    response: '250 2.0.0 Ok: queued',
    envelope: { from: '', to: [ 'dnmsmpvp@gmail.com' ] },
    messageId: '<d4abea96-b6af-171a-adde-f96ed6a28d81@douglas-IPX1800E2>'
  }
*/

class EmailManager {
  async sendMail(mailOptions) {
    if (
      !mailOptions.from ||
      !mailOptions.to ||
      !mailOptions.subject ||
      !mailOptions.html
    )
      throw new Error("MailOptions must be provided");

    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SMTP_HOST,
      port: process.env.EMAIL_SMTP_PORT,
      auth: {
        user: process.env.EMAIL_SMTP_AUTH_USER,
        pass: process.env.EMAIL_SMTP_AUTH_PASS,
      },
    });

    const sentEmail = { id: "jijsa" };
    return sentEmail;
  }
}

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
      console.log(cases[index]);
      const promise = sut.sendMail(cases[index]);
      expect(promise).rejects.toThrow();
    }
  });
});
