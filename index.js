const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/dbConnect");
const userRoutes = require("./routes/user.js");
const projectRoutes = require("./routes/projectroutes.js");
const clientRoutes = require("./routes/clientRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const categorieRoutes = require("./routes/categorieRoutes.js");

// Basic Configuration
const app = express();
const port = process.env.PORT || 9092;

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// Routes path
app.use("/user", userRoutes);
app.use("/project", projectRoutes);
app.use("/client", clientRoutes);
app.use("/product", productRoutes);
app.use("/order", orderRoutes);
app.use("/categorie", categorieRoutes);

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

//Push Notification / Socket IO
app.get("/home", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// io.on("connection", (socket) => {
//   socket.on("chat message", (msg) => {
//     console.log("message: " + msg);
//   });
// });

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});

// MongoDB setup
connectDB();
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
