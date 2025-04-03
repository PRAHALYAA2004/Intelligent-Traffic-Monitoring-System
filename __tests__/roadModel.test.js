import mongoose, { connect, disconnect } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
const Road = require("../models/roadModel")(mongoose);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await connect(uri);
});

afterAll(async () => {
  await disconnect();
  await mongoServer.stop();
});

describe("Road Model Test", () => {
  it("should create and save a road entry successfully", async () => {
    const roadData = { road_name: "Highway 101", number_of_accidents: 10, avg_speed: 70 };
    const road = new Road(roadData);
    const savedRoad = await road.save();

    expect(savedRoad._id).toBeDefined();
    expect(savedRoad.road_name).toBe(roadData.road_name);
  });

  it("should not save a road entry without required fields", async () => {
    const invalidRoad = new Road({ number_of_accidents: 3 });

    let err;
    try {
      await invalidRoad.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
  });
});
