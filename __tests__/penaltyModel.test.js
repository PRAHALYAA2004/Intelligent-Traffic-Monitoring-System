const mongoose = require("mongoose");
const createPenaltyModel = require("../models/penaltyModel");

describe("Penalty Models", () => {
  let connection;
  let PublicData;
  let ViolationData;

  beforeAll(async () => {
    connection = await mongoose.createConnection("mongodb://localhost:27017/testDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const models = createPenaltyModel(connection);
    PublicData = models.PublicData;
    ViolationData = models.ViolationData;
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should create a new public data entry", async () => {
    const publicData = new PublicData({
      car_owner_name: "John Doe",
      vehicle_number: "KA01AB1234",
      phone_number: "9876543210",
      address: "123 Street, City",
      email: "john.doe@example.com",
      vehicle_type: "Car",
      vehicle_model: "Toyota",
      registration_year: 2018,
      license_number: "DL123456",
      penalty_count: 2,
    });

    const savedData = await publicData.save();
    expect(savedData._id).toBeDefined();
    expect(savedData.car_owner_name).toBe("John Doe");
  });

  it("should create a new violation entry", async () => {
    const violation = new ViolationData({
      vehicle_number: "KA01AB1234",
      car_owner_name: "John Doe",
      speed: 80,
      road_type: "Highway",
      penalty_amount: 1000,
    });

    const savedViolation = await violation.save();
    expect(savedViolation._id).toBeDefined();
    expect(savedViolation.speed).toBe(80);
  });

  it("should retrieve violation data", async () => {
    const violation = await ViolationData.findOne({ vehicle_number: "KA01AB1234" });
    expect(violation).toBeDefined();
    expect(violation.penalty_amount).toBe(1000);
  });
});
