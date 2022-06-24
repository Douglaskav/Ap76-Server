jest.mock('bcrypt', () => ({
  isValid: true,

  async compare(value, hash) {
    this.value = value;
    this.hash = hash;
    return this.isValid;
  }
}))

const bcrypt = require("bcrypt");
const Encrypter = require("./encrypter"); 

const makeSut = () => {
  return new Encrypter();  
}

describe("Encrypter", () => {
  test("Should return true if the Encrypter returns true", async () => {
    const sut = makeSut();
    const isValid = await sut.compare('any_value', 'any_hash');
    expect(isValid).toBe(true);
  });

  test("Should return false if the Encrypter returns false", async () => {
    const sut = makeSut();
    bcrypt.isValid = false;
    const isValid = await sut.compare('invalid_value', 'invalid_hash');
    expect(isValid).toBe(false);
  });

  test("Should throw if hash are not provided", async () => {
    const sut = makeSut();
    expect(sut.compare("any_value", "")).rejects.toThrow();
    expect(sut.compare("", "any_hash")).rejects.toThrow();
    expect(sut.compare("", "")).rejects.toThrow();
    expect(sut.compare()).rejects.toThrow();
  });
});
