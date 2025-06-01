const ChargingStation = require("../models/ChargingStationModel")


// Create Charging Station
const createChargingStation = async (req, res) => {

    try {
        const { name, location, status, powerOutput, connectorType } = req.body;
        if (!name || !connectorType || !powerOutput) {
            return res.status(400).json({ message: "All Field are required" });
        }
        if (!location || !location.latitude || !location.longitude) {
            return res.status(400).json({ message: "Latitude and Longitude are required" });
        }

        const newStation = new ChargingStation({
            name,
            location: {
                latitude: location.latitude,
                longitude: location.longitude
            },
            status,
            powerOutput,
            connectorType,
            createdBy: req.user.id
        })

        await newStation.save();
        res.status(201).json({ message: "Charging station created successfully", station: newStation });


    } catch (error) {

        res.status(500).json({ message: "Failed to created station", error: error.message });
    }
}


// All Charging Station
const getAllChargingStations = async (req, res) => {

    try {
        const stations = await ChargingStation.find();
        if (!stations) {
            return res.status(404).json({ message: "No Station is added till now" });
        }

        res.status(200).json(stations)
    } catch (error) {

        res.status(500).json({ message: "Fetching failed", error: error.message });
    }
}



const updateChargingStation = async (req, res) => {
    try {

        const { id } = req.params;
        const { name, location, status, powerOutput, connectorType } = req.body;

        const station = await ChargingStation.findById(id);
        if (!station) {
            return res.ststus(404).json({ message: "Charging station not found" })
        }

        //Optional: check ownership
        if (station.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are Unauthorized to upadate station" });
        }
        station.name = name || station.name;
        station.location.latitude = latitude || station.location.latitude;
        station.location.longitude = longitude || station.location. longitude;
        station.status = status || station.status;
        station.powerOutput = powerOutput || station.powerOutput;
        station.connectorType = connectorType || station.connectorType;

        await station.save();
        res.ststus(200).json({ message: "Updated Charging Station Successfully " , station })

    } catch (error) {
        res.status(500).json({ message: "Update failed", error: error.message });
    }
}


// Delete a charging station by id
const deleteChargingStation = async (req, res) => {
  try {
    const { id } = req.params;

    const station = await ChargingStation.findById(id);
    if (!station) {
      return res.status(404).json({ message: "Charging station not found" });
    }

    
    if (station.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are Unauthorized to delete station" });
    }

    await station.deleteOne();

    res.status(200).json({ message: "Charging station deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
};


module.exports = {
  createChargingStation,
  getAllChargingStations,
  updateChargingStation,
  deleteChargingStation,
};
