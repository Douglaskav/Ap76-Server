const app = require("../app");
const request = require("supertest");
const bcrypt = require("bcrypt");
const MongoHelper = require("../../infra/helpers/mongo-helper");
let userModel;

describe("#Routes suite case", () => {
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

  it("Should return 200 when credentials are valid", async () => {
    await userModel.insertOne({
      email: "any_valid_email@mail.com",
      password: bcrypt.hashSync("any_password_to_hash", 8),
    });
    await request(app)
      .post("/user/login")
      .send({
        email: "any_valid_email@mail.com",
        password: "any_password_to_hash",
      })
      .expect(200);
  });
});
