//config/transportDB.js
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);

let db;

const connectToTransportDB = async () => {
  try {
    await client.connect();
    db = client.db("transport");
    console.log("Connected to Transport MongoDB");
  } catch (error) {
    console.error("Error connecting to Transport MongoDB:", error);
    process.exit(1); // Exit process on failure
  }
};

const getTransportDB = () => {
  if (!db) {
    throw new Error("Transport database not connected");
  }
  return db;
};

module.exports = { connectToTransportDB, getTransportDB };