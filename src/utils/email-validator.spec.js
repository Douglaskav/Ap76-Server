const validator = require("validator"); 
const EmailValidator = require("./email-validator");

const makeSut = () => {
  return new EmailValidator();
}

describe("EmailValidator", () => {
  it("Should return true if the validator returns true", async () => {
    const sut = makeSut();
    let isEmailValid = await sut.isValid("valid_email@mail.com");
    expect(isEmailValid).toBe(true);
  });

  it("Should return false if the validator returns false", async () => {
    const sut = makeSut();
    validator.isEmailValid = false;
    let isEmailValid = await sut.isValid("invalid_email@mail.com");
    expect(isEmailValid).toBe(false);
  });

  it("Should throw if no email is provided", async () => {
    const sut = makeSut();
    let isEmailValid = await sut.isValid();
    expect(isEmailValid.error).toBe(400);
  });
});
