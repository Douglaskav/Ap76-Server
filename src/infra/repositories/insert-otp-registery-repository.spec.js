const MongoHelper = require("../helpers/mongo-helper");
const InsertOTPRegisteryRepository = require("./insert-otp-registery-repository");
let otpModel;

const makeSut = () => {
  return new InsertOTPRegisteryRepository();
};

describe("InsertOTPRegistery Repository", () => {
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

  it("Should throw if InsertOTPRegisteryRepository.insert() don't have params", async () => {
    const sut = makeSut();
    const promise = sut.insert({});
    expect(promise).rejects.toThrow("Missing OTPRepository params");
  });

  it("Should return 200 if the OTP was inserted with successfully", async () => {
    const sut = makeSut();
    const mockDefaultUser = {
      userId: "any_id",
      otp: 999999,
      createdAt: "9231",
      expiresIn: "98231",
    };
    const insertedOtpRegister = await sut.insert(mockDefaultUser);
    expect(insertedOtpRegister.statusCode).toBe(200);
    expect(insertedOtpRegister.insertedOtpRegister).toHaveProperty(
      "insertedId"
    );
  });
});
