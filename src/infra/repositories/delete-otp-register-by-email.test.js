const MongoHelper = require("../helpers/mongo-helper");
const DeleteOtpRegisterByEmail = require("./delete-otp-register-by-email");
let otpModel;

describe("DeleteOtpRegisterByEmail Repository", () => {
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

  it("Should throw if an email are not provided", async () => {
    const sut = new DeleteOtpRegisterByEmail();
    const promise = sut.deleteMany();
    expect(promise).rejects.toThrow();
  });

  it("Should delete a OTPRegister if are provided correct values", async () => {
    const sut = new DeleteOtpRegisterByEmail();
    const mockUser = {
      email: "valid_email@mail.com",
      otp: 999999,
      createdAt: Date.now(),
      expiresIn: Date.now() + 3600000,
    };

    let newUser = await otpModel.insertOne(mockUser);
    
    const deletedUser = await sut.deleteMany(mockUser.email)
    expect(deletedUser.statusCode).toBe(200);
    expect(deletedUser.deletedOTPRegister.deletedCount).not.toBe(0);
  });
});
