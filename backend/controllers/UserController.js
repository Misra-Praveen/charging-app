const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs')
const User = require("../models/UserModel")

const JWT_SECRETKEY = 'secretkey123'

//  Register Controller
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // find user by email, if find then return
        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).json({ message: "User Already Exist" })
        }

        // Convert the password into a secure hashed format 
        const hashPassword = bcrypt.hashSync(password, 10)

        // create new user
        const newUser = new User({
            username,
            email,
            password: hashPassword
        })

        // save new user
        await newUser.save()
        res.status(201).json({ message: "User Register Successfuly" })

    } catch (error) {
        res.status(500).json({ message: "Registration Failed", error: error.message })
    }
}


// Login Controller
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // find user by email, if not find then return
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "Email not exist" })
        }
        // compare a password  it correct or wrong
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Please enter a valid password" })
        }
        // generate token
        const token = jwt.sign({ id: user._id }, JWT_SECRETKEY, { expiresIn: "3d" });

        res.status(200).json({
            message: "Login Successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
            },
        })
    } catch (error) {
        res.status(500).json({ message: "Login Failed", error: error.message })
    }

}

module.exports = { register, login }