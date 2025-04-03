const mongoose = require("mongoose");
const createSchoolModel = require("../models/schoolModel");

describe("SchoolZone Model", () => {
  let connection;
  let SchoolZone;

  beforeAll(async () => {
    connection = await mongoose.createConnection("mongodb://localhost:27017/testDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    SchoolZone = createSchoolModel(connection);
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should create a new school zone entry", async () => {
    const school = new SchoolZone({
      school_name: "Greenwood High",
      number_of_violations: 5,
      school_zone_hours: "07:00 - 19:00",
      violation_details: [
        {
          violation_time: "08:30",
          speed_recorded: 45,
          vehicle_id: "ABC123",
          location_coordinates: "12.9716, 77.5946",
          violation_type: "Over-speeding",
          is_during_operational_hours: true,
          fine_issued: 500,
        },
      ],
    });

    const savedSchool = await school.save();
    expect(savedSchool._id).toBeDefined();
    expect(savedSchool.school_name).toBe("Greenwood High");
  });

  it("should retrieve school zone data", async () => {
    const school = await SchoolZone.findOne({ school_name: "Greenwood High" });
    expect(school).toBeDefined();
    expect(school.number_of_violations).toBe(5);
  });
});
