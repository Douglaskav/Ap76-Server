const app = require("../app");
const request = require("supertest");
const MongoHelper = require("../../infra/helpers/mongo-helper");
const bcrypt = require("bcrypt");
let userModel, otpModel;

let mockUser = {
  username: "any_username",
  email: "any_valid_email@mail.com",
  password: bcrypt.hashSync("any_password_to_hash", 8),
};

describe("#Routes suite case", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
    const db = await MongoHelper.db;
    userModel = db.collection("users");
    otpModel = db.collection("otpRegisters");
  });

  beforeEach(async () => {
    await userModel.deleteMany();
    await otpModel.deleteMany();
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  it("Should test if /user/login is working", async () => {
    await userModel.insertOne(mockUser);
    await userModel.updateOne(
      { email: mockUser.email },
      { $set: { verified: true } }
    );

    await request(app)
      .post("/user/login")
      .send({
        email: "any_valid_email@mail.com",
        password: "any_password_to_hash",
      })
      .expect(200);
  });

  it("Should return a badRequest error if httpRequest.body is missing params", async () => {
    await userModel.insertOne(mockUser);
    await userModel.updateOne(
      { email: mockUser.email },
      { $set: { verified: true } }
    );

    await request(app)
      .post("/user/login")
      .send({
        email: "",
        password: "any_password_to_hash",
      })
      .expect(400);
  });

  it("Should return an unauthorizedError if wrong credentials are provided", async () => {
    await userModel.insertOne(mockUser);

    await request(app)
      .post("/user/login")
      .send({
        email: "invalid_email@mail.com",
        password: "any_password_to_hash",
      })
      .expect(401);
  });

  it("Should return an unauthorizedError error if the user not was found", async () => {
    await request(app)
      .post("/user/login")
      .send({
        email: "any_valid_email@mail.com",
        password: "any_password_to_hash",
      })
      .expect(401);
  });
});
