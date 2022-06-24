jest.mock("jsonwebtoken", () => ({
  token: "any_token",

  sign(payload, secret) {
    this.payload = payload;
    this.secret = secret;
    return this.token;
  },
}));

const jwt = require("jsonwebtoken");
const TokenGenerator = require("./tokenGenerator");

const makeSut = () => {
  return new TokenGenerator("secret");
};

describe("TokenGenerator", () => {
  it("Should return null if TokenGenerator returns null", async () => {
    const sut = makeSut();
    jwt.token = null;
    const accessToken = await sut.generate("any_id");
    expect(accessToken).toBeNull();
  });

  it("Should throw if the userId is not provided", () => {
    const sut = makeSut();
    const promise = sut.generate();
    expect(promise).rejects.toThrow();
  });

  it("Should throw if the secret is not provided", () => {
    const sut = makeSut();
    const promise = sut.generate();
    expect(promise).rejects.toThrow();
  });

  it("Should return a token if TokenGenerator returns the token",  () => {
    const sut = new TokenGenerator();
    const promise = sut.generate("any_id");
    expect(promise).rejects.toThrow();
  });
});
