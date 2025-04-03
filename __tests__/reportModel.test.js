const mongoose = require("mongoose");
const createReportModel = require("../models/reportModel");

describe("Report Model", () => {
  let connection;
  let Report;

  beforeAll(async () => {
    connection = await mongoose.createConnection("mongodb://localhost:27017/testDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    Report = createReportModel(connection);
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should create a new report entry", async () => {
    const report = new Report({
      date_of_incident: "2025-04-01",
      time_of_incident: "14:30",
      location: "5th Avenue, NY",
      vehicle_make: "Toyota",
      vehicle_model: "Camry",
      vehicle_color: "Red",
      license_plate: "NY1234AB",
      violation_type: "Over-speeding",
      description: "The vehicle was exceeding the speed limit in a school zone.",
      reporter_name: "Alice Johnson",
      reporter_email: "alice@example.com",
      reporter_phone: "9876543210",
      report_id: "REP12345",
    });

    const savedReport = await report.save();
    expect(savedReport._id).toBeDefined();
    expect(savedReport.status).toBe("in progress"); // Default status
    expect(savedReport.vehicle_make).toBe("Toyota");
    expect(savedReport.reporter_email).toBe("alice@example.com");
  });

  it("should retrieve a report entry", async () => {
    const report = await Report.findOne({ report_id: "REP12345" });
    expect(report).toBeDefined();
    expect(report.violation_type).toBe("Over-speeding");
    expect(report.location).toBe("5th Avenue, NY");
  });

  it("should update a report status", async () => {
    await Report.updateOne({ report_id: "REP12345" }, { status: "resolved" });
    const updatedReport = await Report.findOne({ report_id: "REP12345" });
    expect(updatedReport.status).toBe("resolved");
  });
});
