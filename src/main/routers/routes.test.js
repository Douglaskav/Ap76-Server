const app = require("../app");
const request = require("supertest");
const MongoHelper = require("../../infra/helpers/mongo-helper");
const bcrypt = require("bcrypt");
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

  it("Should test if /use/create is working", async () => {
    await request(app)
      .post("/user/create")
      .send({
        username: "any_username",
        email: "any_valid_email@mail.com",
        password: "any_password_to_hash",
      })
      .expect(200);
  });

  it("Should test if /user/login is working", async () => {
    let mockUser = {
      username: "any_username",
      email: "any_valid_email@mail.com",
      password: bcrypt.hashSync("any_password_to_hash", 10)
    }

    await userModel.insertOne(mockUser);

    await request(app)
      .post("/user/login")
      .send({
        email: "any_valid_email@mail.com",
        password: "any_password_to_hash",
      })
      .expect(200);
  });

  it("Should test if /user/verify is working", async () => {
    const newUser = await request(app).post("/user/create").send({
      username: "any_username",
      email: "any_valid_email@mail.com",
      password: "any_password_to_hash",
    });

    await request(app).post("/user/verify").send({
      email: newUser.body.email,
      otp: newUser.body.otp
    }).expect(200);
  });
});
