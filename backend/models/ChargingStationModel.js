const mongoose = require("mongoose");


const chargingStationSchema = new mongoose.Schema({
    name : {
        type : String,
        required: true,
        trim: true,
    },
    location : {
        latitude : {
            type: Number,
            required: true,
        },
        longitude : {
            type: Number,
            required: true,
        }
    },
    status : {
       type: String,
       enum: ['Active','Inactive'],
       default: 'Active',
       required: true
    },
    powerOutput:{
        type: Number,
        required: true,

    },
    connectorType:{
        type: String,
        required: true,
        
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : true
    }
}, { timestamps: true })


module.exports = mongoose.model("ChargingStation", chargingStationSchema)