const mongoose = require("mongoose")

const userShema = new mongoose.Schema (
    {
        username: {
            type: String,
            require: true,
            trim: true,
        },
        email: {
            type: String,
            require: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            require: true,
            
        }
    }, {timestamps:true}
)

module.exports = mongoose.model("User", userSchema)