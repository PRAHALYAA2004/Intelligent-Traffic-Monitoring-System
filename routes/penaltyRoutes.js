// routes/penaltyRoutes.js
const express = require('express');
const router = express.Router();

module.exports = (PublicData, ViolationData) => {
  // Get public data by vehicle number
  router.get('/public_data/:vehicle_number', async (req, res) => {
    try {
      const vehicleNumber = req.params.vehicle_number.trim().toUpperCase();
      console.log(`Received request for vehicle_number: "${vehicleNumber}"`);
      console.log(`Querying database: ${PublicData.db.db.databaseName}, collection: public_data`);

      const publicData = await PublicData.findOne({ vehicle_number: vehicleNumber });
      console.log(`Query result:`, publicData);

      if (!publicData) {
        console.log(`Vehicle "${vehicleNumber}" not found in public_data`);
        const allVehicles = await PublicData.find({}, { vehicle_number: 1 });
        console.log('All vehicle numbers in public_data:', allVehicles.map(v => v.vehicle_number));
        return res.status(404).json({ error: `Vehicle "${vehicleNumber}" not found in public data` });
      }
      res.json(publicData);
    } catch (error) {
      console.error('Error fetching public data:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Insert violation data
  router.post('/violation_data', async (req, res) => {
    try {
      const { vehicle_number, speed, road_type, penalty_amount } = req.body;
      const normalizedVehicleNumber = vehicle_number.trim().toUpperCase();
      console.log(`Received violation data:`, { vehicle_number: normalizedVehicleNumber, speed, road_type, penalty_amount });

      // Fetch public data for the vehicle
      const publicData = await PublicData.findOne({ vehicle_number: normalizedVehicleNumber });
      if (!publicData) {
        console.log(`Vehicle "${normalizedVehicleNumber}" not found for violation`);
        return res.status(404).json({ error: `Vehicle "${normalizedVehicleNumber}" not found in public data` });
      }

      // Create new violation record
      const violationData = new ViolationData({
        vehicle_number: normalizedVehicleNumber,
        car_owner_name: publicData.car_owner_name,
        speed,
        road_type,
        penalty_amount,
      });

      await violationData.save();
      console.log(`Violation saved:`, violationData);

      // Update penalty count in public data
      publicData.penalty_count = (publicData.penalty_count || 0) + 1;
      await publicData.save();
      console.log(`Updated penalty_count for ${normalizedVehicleNumber}: ${publicData.penalty_count}`);

      res.status(201).json(violationData);
    } catch (error) {
      console.error('Error inserting violation data:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get all violation data
  router.get('/violation_data', async (req, res) => {
    try {
      const violationData = await ViolationData.find();
      console.log(`Fetched ${violationData.length} violations`);
      res.json(violationData);
    } catch (error) {
      console.error('Error fetching violation data:', error);
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};