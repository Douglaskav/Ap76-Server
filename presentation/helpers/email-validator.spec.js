const validator = require("validator"); 
const EmailValidator = require("./email-validator");

const makeSut = () => {
  const sut = new EmailValidator();
  return { sut };
};

describe("EmailValidator", () => {
  test("Should return true if the validator returns true", async () => {
    const { sut } = makeSut();
    let isValid = await sut.isValid("valid_email@mail.com");
    expect(isValid).toBe(true);
  });

  test("Should return false if the validator returns false", async () => {
    const { sut } = makeSut();
    validator.isEmailValid = false;
    let isValid = await sut.isValid("invalid_email@mail.com");
    expect(isValid).toBe(false);
  });

  test("Should throw if no email is provided", () => {
    const { sut } = makeSut();
    expect(sut.isValid).toThrow();
  });
});
