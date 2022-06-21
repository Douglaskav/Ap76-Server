const validator = require("validator"); 
const isValid = require("./email-validator");

describe("EmailValidator", () => {
  test("Should return true if the validator returns true", () => {
    let isEmailValid = isValid("valid_email@mail.com");
    expect(isEmailValid).toBe(true);
  });

  test("Should return false if the validator returns false", () => {
    validator.isEmailValid = false;
    let isEmailValid = isValid("invalid_email@mail.com");
    expect(isEmailValid).toBe(false);
  });

  test("Should throw if no email is provided", () => {
    let isEmailValid = isValid();
    expect(isEmailValid.error).toBe(400);
  });
});
