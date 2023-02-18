const express = require("express");

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/dbConnect");
const userRoutes = require("./routes/user.js");
const paymentRoutes = require("./routes/payment.js");

//Basic Configuration
const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.set("view engine", "ejs");


//Routes path
app.use("/user", userRoutes);
app.use("/payment", paymentRoutes);


//MongoDB setup
connectDB();
const PORT = process.env.PORT || 9092;
app.listen(PORT, (err) =>
  err ? console.log(err) : console.log(`server is running on PORT ${PORT}`)
);

app.get("/", (req, res) => {
  res.send("Welcome to Fuel me App !!!!!");
});
