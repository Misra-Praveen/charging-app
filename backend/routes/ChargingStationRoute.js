const express = require("express")
const router = express.Router();
const protect = require("../middleware/authMiddleware");


const { createChargingStation,getAllChargingStations, updateChargingStation, deleteChargingStation } = require("../controllers/ChargingStationController")


router.post("/", protect, createChargingStation)
router.get("/", getAllChargingStations)
router.put("/:id", protect, updateChargingStation)
router.delete("/:id", protect, deleteChargingStation);

module.exports= router;