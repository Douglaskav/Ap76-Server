const app = require("../app");
const request = require("supertest");
const MongoHelper = require("../../infra/helpers/mongo-helper");
const bcrypt = require("bcrypt");
let userModel, otpModel;

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

  it("Should return an unauthorizedError if the user not exists", async () => {
    await request(app)
      .post("/user/resend_otp")
      .send({
        email: "invalid_email@mail.com",
      })
      .expect(401);
  });

  it("Should test if /user/resend_otp is working", async () => {
    await request(app).post("/user/create").send({
      username: "any_username",
      email: "any_valid_email@mail.com",
      password: "any_password_to_hash",
    });

    await request(app)
      .post("/user/resend_otp")
      .send({
        email: "any_valid_email@mail.com",
      })
      .expect(200);
  });
});
