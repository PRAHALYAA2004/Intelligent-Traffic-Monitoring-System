const mongoose = require("mongoose");
const createRoadModel = require("../models/roadModel");

describe("RoadSpeed Model", () => {
  let connection;
  let RoadSpeed;

  beforeAll(async () => {
    connection = await mongoose.createConnection("mongodb://localhost:27017/testDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    RoadSpeed = createRoadModel(connection);
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should create a new road entry", async () => {
    const road = new RoadSpeed({
      road_name: "Main Street",
      speed_limit: "30-60",
      restrictions: "No heavy vehicles",
    });

    const savedRoad = await road.save();
    expect(savedRoad._id).toBeDefined();
    expect(savedRoad.road_name).toBe("Main Street");
    expect(savedRoad.speed_limit).toBe("30-60");
  });

  it("should retrieve road data", async () => {
    const road = await RoadSpeed.findOne({ road_name: "Main Street" });
    expect(road).toBeDefined();
    expect(road.restrictions).toBe("No heavy vehicles");
  });
});
