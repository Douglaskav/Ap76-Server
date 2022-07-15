const MongoHelper = require("../helpers/mongo-helper");
const DeleteOTPRegisteryByUserId = require("./delete-otp-register-by-user-id-repository");
let otpModel;

describe("DeleteOTPRegisteryByUserId Repository", () => {
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

  it("Should throw if userId are not provided", async () => {
    const sut = new DeleteOTPRegisteryByUserId();
    const promise = sut.deleteMany();
    expect(promise).rejects.toThrow();
  });

  it("Should delete a OTPRegister if are provided correct values", async () => {
    const sut = new DeleteOTPRegisteryByUserId();
    const mockUser = {
      userId: "valid_user_id",
      otp: 999999,
      createdAt: Date.now(),
      expiresIn: Date.now() + 3600000,
    };

    let newUser = await otpModel.insertOne(mockUser);
    
    const deletedUser = await sut.deleteMany(mockUser.userId)
    expect(deletedUser.statusCode).toBe(200);
    expect(deletedUser.deletedOTPRegister.deletedCount).not.toBe(0);
  });
});
