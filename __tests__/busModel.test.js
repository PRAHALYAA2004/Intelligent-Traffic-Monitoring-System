const mongoose = require("mongoose");
const createBusModel = require("../models/busModel");

describe("Bus Model", () => {
  let connection;
  let Bus;

  beforeAll(async () => {
    connection = await mongoose.createConnection("mongodb://localhost:27017/testDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    Bus = createBusModel(connection);
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should create a new bus entry", async () => {
    const bus = new Bus({
      vehicleNo: "KA01AB5678",
      pickup: "Station A",
      drop: "Station B",
      time: "10:30 AM",
    });

    const savedBus = await bus.save();
    expect(savedBus._id).toBeDefined();
    expect(savedBus.vehicleNo).toBe("KA01AB5678");
  });

  it("should retrieve bus data", async () => {
    const bus = await Bus.findOne({ vehicleNo: "KA01AB5678" });
    expect(bus).toBeDefined();
    expect(bus.pickup).toBe("Station A");
    expect(bus.drop).toBe("Station B");
  });
});
