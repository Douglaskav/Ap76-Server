const nodemailer = require("nodemailer");

module.exports = class EmailManager {
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

    const sentEmail = await transporter.sendMail(mailOptions);
    return { sentEmail, statusCode: 200 };
  }
}
