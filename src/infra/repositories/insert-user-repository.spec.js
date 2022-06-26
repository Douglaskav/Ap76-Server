const MongoHelper = require("../helpers/mongo-helper");
const InsertUserRepository = require("./insert-user-repository");
let userModel;

const makeSut = () => {
  return new InsertUserRepository();
};

describe("InsertUser Repository", () => {
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

  it("Should throw if are missing params", async () => {
    const sut = makeSut();
    const cases = [
      { username: "", email: "any_mail@mail.com", hashedPassword: "any_password", },
      { username: "any_username", email: "", hashedPassword: "any_password" },
      { username: "any_username", email: "any_mail@mail.com", hashedPassword: "", }
    ];
    
    for (const mock in cases) {
      const promise = sut.insert(cases[mock]);
      expect(promise).rejects.toThrow();
    }
  });

  it("Should insert an user into users collection", async () => {
    const sut = makeSut();
    const mockUser = { email: "any_mail@mail.com", username: "any_username", hashedPassword: "any_password" };
    const insertedUser = await sut.insert(mockUser);
    expect(insertedUser).toHaveProperty("insertedId");
  })
});
