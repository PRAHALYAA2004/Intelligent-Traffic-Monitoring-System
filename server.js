// server.js
require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");

// Models
const userModel = require("./models/userModel");
const roadModel = require("./models/roadModel");
const schoolModel = require("./models/schoolModel");
const busModel = require("./models/busModel");
const penaltyModel = require("./models/penaltyModel");
const reportModel = require("./models/reportModel"); // New model for traffic_watch

// Routes
const authRoutes = require("./routes/authRoutes");
const penaltyRoutes = require("./routes/penaltyRoutes");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Initialize Databases and Models
let User, RoadSpeed, SchoolZone, Bus, PublicData, ViolationData, Report;
let connections = {};

const initializeDBs = async () => {
  const {
    trafficConn,
    zoneSpeedConn,
    schoolZoneConn,
    transportConn,
    penaltyConn,
    trafficWatchConn,
  } = await connectDB();

  // Store connections for graceful shutdown
  connections = {
    trafficConn,
    zoneSpeedConn,
    schoolZoneConn,
    transportConn,
    penaltyConn,
    trafficWatchConn,
  };

  // Initialize models with their respective connections
  User = userModel(trafficConn);
  RoadSpeed = roadModel(zoneSpeedConn);
  SchoolZone = schoolModel(schoolZoneConn);
  Bus = busModel(transportConn);
  const penaltyModels = penaltyModel(penaltyConn);
  PublicData = penaltyModels.PublicData;
  ViolationData = penaltyModels.ViolationData;
  Report = reportModel(trafficWatchConn); // Initialize the Report model

  // Debug: Confirm models are initialized
  console.log("User model initialized:", User ? "Yes" : "No");
  console.log("Report model initialized:", Report ? "Yes" : "No");

  return { User, RoadSpeed, SchoolZone, Bus, PublicData, ViolationData, Report };
};

// Function to generate a random report ID
function generateReportId() {
  const prefix = "CTW-";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return prefix + result;
}

// API Routes
const setupRoutes = (User, RoadSpeed, SchoolZone, Bus, PublicData, ViolationData, Report) => {
  // Existing Routes
  app.get("/api/speed/:road", async (req, res) => {
    try {
      let roadName = req.params.road.toLowerCase().trim();
      roadName = roadName
        .replace(/é/g, "e")
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, " ");
      const road = await RoadSpeed.findOne({
        road_name: { $regex: `^${roadName}$`, $options: "i" },
      });
      if (!road) {
        return res.status(404).json({ message: "Road not found" });
      }
      res.json({
        road_name: road.road_name,
        speed_limit: road.speed_limit,
        restrictions: road.restrictions,
      });
    } catch (err) {
      console.error("Error fetching speed limit:", err);
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/schools", async (req, res) => {
    try {
      const schools = await SchoolZone.find({});
      if (!schools || schools.length === 0) {
        return res.status(404).json({ message: "No schools found" });
      }
      res.json(schools);
    } catch (err) {
      console.error("Error fetching schools:", err);
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/school/:name", async (req, res) => {
    try {
      let schoolName = req.params.name.toLowerCase().trim();
      const school = await SchoolZone.findOne({
        school_name: { $regex: `^${schoolName}$`, $options: "i" },
      });
      if (!school) {
        return res.status(404).json({ message: "School not found" });
      }
      res.json(school);
    } catch (err) {
      console.error("Error fetching school:", err);
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/bus", async (req, res) => {
    try {
      const buses = await Bus.find();
      console.log("Buses:", buses);
      if (!buses || buses.length === 0) {
        return res.status(404).json({ message: "No bus schedules found" });
      }
      res.json(buses);
    } catch (error) {
      console.error("Error fetching bus schedules:", error);
      res.status(500).json({ message: "Error fetching bus schedules" });
    }
  });

  app.post("/api/bus", async (req, res) => {
    const { vehicleNo, pickup, drop, time } = req.body;
    if (!vehicleNo || !pickup || !drop || !time) {
      return res.status(400).json({ message: "All fields are required" });
    }
    try {
      const newBus = new Bus({ vehicleNo, pickup, drop: drop, time });
      await newBus.save();
      res.json(newBus);
    } catch (error) {
      res.status(500).json({ message: "Error adding bus schedule" });
    }
  });

  app.put("/api/bus/:id", async (req, res) => {
    const { id } = req.params;
    const { pickup, drop, time } = req.body;
    if (!pickup || !drop || !time) {
      return res.status(400).json({ message: "All fields are required" });
    }
    try {
      const result = await Bus.updateOne(
        { _id: id },
        { $set: { pickup, drop: drop, time } }
      );
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Bus schedule not found" });
      }
      res.json({ message: "Schedule updated successfully!" });
    } catch (error) {
      console.error("Error updating bus schedule:", error);
      res.status(500).json({ message: "Error updating bus schedule" });
    }
  });

  app.delete("/api/bus/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const result = await Bus.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Bus schedule not found" });
      }
      res.json({ message: "Bus schedule deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting bus schedule" });
    }
  });

  // New Routes for traffic-signal.html
  app.post("/api/submit-report", async (req, res) => {
    try {
        console.log("Received form data:", req.body);
        const formData = req.body;

        const reportId = generateReportId();
        console.log("Generated report ID:", reportId);

        const reportData = new Report({
            ...formData,
            report_id: reportId,
            status: "in progress",
            created_at: new Date(),
        });

        console.log("Saving report to database...");
        await reportData.save();
        console.log("Report saved successfully:", reportData);

        res.status(200).json({ reportId });
    } catch (error) {
        console.error("Error saving report:", error.message, error.stack);
        res.status(500).json({ error: "Failed to save report", details: error.message });
    }
});

  app.get("/api/check-status/:reportId", async (req, res) => {
    try {
      const reportId = req.params.reportId;
      const report = await Report.findOne({ report_id: reportId });

      if (report) {
        res.status(200).json({
          status: report.status,
          details: `Your report is currently ${report.status}.`,
        });
      } else {
        res.status(404).json({
          status: "Not Found",
          details: "No report found with this ID. Please check the ID and try again.",
        });
      }
    } catch (error) {
      console.error("Error checking report status:", error);
      res.status(500).json({ error: "Failed to check report status" });
    }
  });

  // Auth Routes
  app.use("/api", authRoutes(User));

  // Penalty Routes
  app.use("/api", penaltyRoutes(PublicData, ViolationData));
};

// Serve Frontend Routes

app.get("/zonespeed", (req, res) => {
  res.sendFile(path.join(__dirname, "user-dashboard", "speed-violation.html"));
});

app.get("/school-zone", (req, res) => {
  res.sendFile(path.join(__dirname, "admin-dashboard", "signal-management.html"));
});

app.get("/admin-dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "admin-dashboard", "admin-dashboard.html"));
});

app.get("/user-dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "user-dashboard", "user-dashboard.html"));
});

app.get("/traffic-signal", (req, res) => {
  res.sendFile(path.join(__dirname, "user-dashboard", "predictive-traffic.html"));
});

// Start Server
const startServer = async () => {
  const models = await initializeDBs();
  setupRoutes(
    models.User,
    models.RoadSpeed,
    models.SchoolZone,
    models.Bus,
    models.PublicData,
    models.ViolationData,
    models.Report
  );
  server.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
};

// Graceful Shutdown
const shutdown = async () => {
  console.log("Shutting down server...");
  try {
    for (const [name, conn] of Object.entries(connections)) {
      await conn.close();
      console.log(`${name} connection closed`);
    }
    server.close(() => {
      console.log("HTTP server closed");
      process.exit(0);
    });
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Start the server
startServer();

// Socket.IO
io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});