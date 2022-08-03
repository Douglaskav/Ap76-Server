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

  it("Should return a badRequest error if is missing params", async () => {
    await request(app)
      .post("/user/verify")
      .send({ email: "", otp: "999999" })
      .expect(400);
  });

  it("Should return an unauthorizedError if the wrong otp code is provided", async () => {
    const newUser = await request(app).post("/user/create").send({
      username: "any_username",
      email: "any_valid_email@mail.com",
      password: "any_password_to_hash",
    });

    await request(app)
      .post("/user/verify")
      .send({
        email: newUser.body.email,
        otp: "999999",
      })
      .expect(401);
  });

  it("Should test if /user/verify is working", async () => {
    const newUser = await request(app).post("/user/create").send({
      username: "any_username",
      email: "any_valid_email@mail.com",
      password: "any_password_to_hash",
    });

    /**
     *
     * change the otp code to be 999999.
     */
    let SALT_ROUND = 8;
    await otpModel.updateOne(
      { email: newUser.body.email },
      { $set: { otp: bcrypt.hashSync("999999", 8) } }
    );

    await request(app)
      .post("/user/verify")
      .send({
        email: newUser.body.email,
        otp: "999999",
      })
      .expect(200);
  });
});
