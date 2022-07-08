const MongoHelper = require("../helpers/mongo-helper");
const InsertVerifyToUser = require("./insert-verify-to-user-repository");
let userModel;

describe("InsertVerifyToUser Repository", () => {
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

  it("Should throw if _id wasn't provided", () => {
    const sut = new InsertVerifyToUser();
    const promise = sut.verify({});
    expect(promise).rejects.toThrow();
  });

  it("Should throw if not was possible to update the user", () => {
    const sut = new InsertVerifyToUser();
    const promise = sut.verify({ _id: "invalid_user_id" });
    expect(promise).rejects.toThrow("Not was possible update the user");
  });

  it("Should update the user without error and return 200", async () => {
    const sut = new InsertVerifyToUser();

    const mockUser = {
      email: "any_mail@mail.com",
      username: "any_username",
      hashedPassword: "any_password",
      verified: false,
    };

    let newUser = await userModel.insertOne(mockUser);

    const updatedUser = await sut.verify({
      _id: newUser.insertedId,
      verifyTo: true,
    });
    expect(updatedUser.statusCode).toBe(200);
  });
});