jest.mock("bcrypt", () => ({
  isValid: true,
  hashedPassword: "any_hash",

  async compare(value, hash) {
    this.value = value;
    this.hash = hash;
    return this.isValid;
  },

  async hashSync(password, saltRound) {
    this.password = password;
    this.saltRound = saltRound;
    return this.hashedPassword;
  },
}));

const bcrypt = require("bcrypt");
const Encrypter = require("./encrypter");

const makeSut = () => {
  return new Encrypter();
};

describe("Encrypter", () => {
  it("Should return true if the Encrypter returns true", async () => {
    const sut = makeSut();
    const isValid = await sut.compare("any_value", "any_hash");
    expect(isValid).toBe(true);
  });

  it("Should return false if the Encrypter returns false", async () => {
    const sut = makeSut();
    bcrypt.isValid = false;
    const isValid = await sut.compare("invalid_value", "invalid_hash");
    expect(isValid).toBe(false);
  });

  it("Should throw if hash are not provided", () => {
    const sut = makeSut();
    expect(sut.compare("any_value", "")).rejects.toThrow();
    expect(sut.compare("", "any_hash")).rejects.toThrow();
    expect(sut.compare("", "")).rejects.toThrow();
    expect(sut.compare()).rejects.toThrow();
  });

  it("Should throw if hashSync was been called without password", () => {
    const sut = makeSut();
    const hashedPassword = sut.generateHash("", 8);
    expect(hashedPassword).rejects.toThrow();
  });

  it("Should throw if hashSync was been called without saltRound", () => {
    const sut = makeSut();
    const hashedPassword = sut.generateHash("any_password");
    expect(hashedPassword).rejects.toThrow();
  });

  it("Should return an hash if everything is ok", async () => {
    const sut = makeSut();
    const hashedPassword = await sut.generateHash("any_password", 8);
    expect(hashedPassword).toBe("any_hash");
  });
});
