const MongoHelper = require("../helpers/mongo-helper");
const LoadUserByEmailRepository = require("./load-user-by-email-repository");
let userModel;

const makeSut = () => {
  return new LoadUserByEmailRepository();
};

describe("LoadUserByEmailRepository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
    const db = await MongoHelper.db;
    userModel = db.collection("users");
  });

  beforeEach(async () => {
    await userModel.deleteMany();
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  it("Should return null if an user is not found", async () => {
    const sut = makeSut();
    const user = await sut.load("invalid_email@mail.com");
    expect(user).toBeNull();
  });

  it("Should return an 400 if an email is not provided", async () => {
    const sut = makeSut();
    const user = await sut.load();
    expect(user.statusCode).toBe(400);
  });

  it("Should return an user if user is found", async () => {
    const sut = makeSut();
    let mockUser = { name: "John Doe", email: "valid_email@mail.com" };
    const insertedUser = await userModel.insertOne(mockUser);
    const user = await sut.load("valid_email@mail.com");
    expect(user._id).toStrictEqual(insertedUser.insertedId);
  });
});
