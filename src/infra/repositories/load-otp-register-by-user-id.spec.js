const MongoHelper = require("../helpers/mongo-helper");
const LoadOTPRegisterByUserIdRepository = require("./load-user-by-email-repository");
let otpModel;

const makeSut = () => {
  return new LoadOTPRegisterByUserIdRepository();
};

describe("LoadOTPRegisterByUserIdRepository", () => {
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
    const user = await sut.load("invalid_id");
    expect(user).toBeNull();
  });

  it("Should return an 400 if an userId is not provided", async () => {
    const sut = makeSut();
    const user = await sut.load();
    expect(user.statusCode).toBe(400);
  });

  // it("Should return an user if user is found", async () => {
  //   const sut = makeSut();
  //   let mockUser = {  };
  //   const insertedUser = await otpModel.insertOne();
  //   const user = await sut.load("valid_email@mail.com");
  //   expect(user._id).toStrictEqual(insertedUser.insertedId);
  // });
});
