const validator = require("validator"); 
const EmailValidator = require("./email-validator");

const makeSut = () => {
  return new EmailValidator();
}

describe("EmailValidator", () => {
  it("Should return true if the validator returns true", () => {
    const sut = makeSut();
    let isEmailValid = sut.isValid("valid_email@mail.com");
    expect(isEmailValid).toBe(true);
  });

  it("Should return false if the validator returns false", () => {
    const sut = makeSut();
    validator.isEmailValid = false;
    let isEmailValid = sut.isValid("invalid_email@mail.com");
    expect(isEmailValid).toBe(false);
  });

  it("Should throw if no email is provided", () => {
    const sut = makeSut();
    let isEmailValid = sut.isValid();
    expect(isEmailValid.error).toBe(400);
  });
});
