const { MongoClient } = require("mongodb");

class LoadUserByEmailRepository {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async load(email) {
    const user = await this.userModel.findOne({ email });
    return user;
  }
}

describe("LoadUserByEmail Repository", () => {
  let client, db;

  beforeAll(async () => {
    client = await MongoClient.connect(globalThis.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await client.db();
  });

  beforeEach(async () => {
    await db.collection("users").deleteMany();
  });

  afterAll(async () => {
    await client.close();
  })

  test("Should return null if no user is found", async () => {
    const userModel = db.collection("users");
    const sut = new LoadUserByEmailRepository(userModel);
    const user = await sut.load("invalid_email@mail.com");
    expect(user).toBeNull();
  });

  test("Should return an user if user is found", async () => {
    // essa collection não existe e está sendo criada agora.
    const userModel = db.collection("users");
    await userModel.insertOne({
      email: "valid_email@mail.com",
    });
    const sut = new LoadUserByEmailRepository(userModel);
    const user = await sut.load("valid_email@mail.com");
    expect(user.email).toBe("valid_email@mail.com");
  });
});
