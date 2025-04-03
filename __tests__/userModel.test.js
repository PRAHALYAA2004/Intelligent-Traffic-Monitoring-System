const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../models/userModel")(mongoose);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("User Model Test", () => {
  it("should create and save a user successfully", async () => {
    const userData = { username: "testUser", emailid: "test@example.com", password: "secure123", role: "admin" };
    const validUser = new User(userData);
    const savedUser = await validUser.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe(userData.username);
  });

  it("should not save a user without required fields", async () => {
    const userWithoutEmail = new User({ username: "testUser", password: "secure123" });

    let err;
    try {
      await userWithoutEmail.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
  });
});
