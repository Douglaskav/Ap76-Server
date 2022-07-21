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

  it("Should test if /user/create is working", async () => {
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
      password: bcrypt.hashSync("any_password_to_hash", 8),
    };

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
