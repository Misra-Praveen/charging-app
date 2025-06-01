const jwt = require("jsonwebtoken");
const JWT_SECRETKEY = "secretkey123";

const User = require("../models/UserModel")


const protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "No token, access denied" });
        }

        const decoded = jwt.verify(token, JWT_SECRETKEY)

        const user = await User.findById(decoded.id);
        if (!user) return res.status(401).json({ message: "User not found" });

        req.user = user;
        console.log("Logged in user:", req.user);
        next();


    } catch (error) {

         res.status(401).json({ message: "Invalid token", error: err.message });
    }
}

module.exports = protect