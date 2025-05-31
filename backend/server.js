const express = require("express")
const mongoose = require("mongoose")
const cors = require('cors')


const authRoutes = require("./routes/UserRoute")


const PORT = 3000;
// connect to database
mongoose.connect('mongodb+srv://praveen:Reaction@cluster0.c35enxr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

const db = mongoose.connection();
db.on("open", () => {
   console.log("Mongodb connected Successfuly")
})
db.on("error", (err) => {
   console.log("Error", err)
})

const app = new express();

app.listen(PORT, () => {
   console.log(`server is running at port ${PORT}`)
})


// middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/auth", authRoutes)