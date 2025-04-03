const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const SchoolZone = require("../models/schoolModel")(mongoose);

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

describe("School Model Test", () => {
  it("should create and save school zone data successfully", async () => {
    const schoolZoneData = {
      school_name: "Greenwood High",
      number_of_violations: 5,
      school_zone_hours: "8 AM - 5 PM",
      violation_details: [{ violation_time: "9:00 AM", speed_recorded: 45, vehicle_id: "KA05AB1234", violation_type: "Over-speeding" }],
    };

    const schoolZone = new SchoolZone(schoolZoneData);
    const savedSchoolZone = await schoolZone.save();

    expect(savedSchoolZone._id).toBeDefined();
    expect(savedSchoolZone.school_name).toBe(schoolZoneData.school_name);
  });

  it("should not save school zone without required fields", async () => {
    const invalidSchoolZone = new SchoolZone({ number_of_violations: 3 });

    let err;
    try {
      await invalidSchoolZone.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
  });
});
