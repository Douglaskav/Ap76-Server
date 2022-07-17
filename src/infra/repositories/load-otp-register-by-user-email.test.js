const MongoHelper = require("../helpers/mongo-helper");
const LoadOTPRegisterByEmail = require("./load-otp-register-by-user-email");
let otpModel;

const makeSut = () => {
  return new LoadOTPRegisterByEmail();
};

describe("LoadOTPRegisterByEmail", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
    const db = await MongoHelper.db;
    otpModel = db.collection("otpRegisters");
  });

  beforeEach(async () => {
    await otpModel.deleteMany();
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  it("Should return null if an user is not found", async () => {
    const sut = makeSut();
    const user = await sut.load("invalid_email");
    expect(user).toBeNull();
  });

  it("Should return an 400 if an email is not provided", async () => {
    const sut = makeSut();
    const user = await sut.load();
    expect(user.statusCode).toBe(400);
  });

  it("Should return an user if user is found", async () => {
    const sut = makeSut();
    const mockUser = {
      _id: "any_id",
      email: "any_mail@mail.com",
      otp: 999999,
      createdAt: Date.now(),
      expiresIn: Date.now() + 3600000,
    };

    const insertedUser = await otpModel.insertOne(mockUser);
    const user = await sut.load(mockUser.email);

    expect(user._id).toStrictEqual(mockUser._id);
  });
});
