const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/dbConnect");
const http = require("http");
const userRoutes = require("./routes/user.js");
const projectRoutes = require("./routes/projectroutes.js");
const clientRoutes = require("./routes/clientRoutes.js");
const categoryRoutes = require("./routes/categoryRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const statsRoutes = require("./routes/statRoutes.js");
const reclamationRoutes = require("./routes/reclamationRoutes");
//Upload Image
const cloudinary = require("./uploads/cloudinary");
const uploader = require("./uploads/multer");

//Basic Configuration
const app = express();

const server = http.createServer(app);
const io = require('socket.io')(server);
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

//Routes path
app.use("/user", userRoutes);
app.use("/project", projectRoutes);
app.use("/client", clientRoutes);
app.use("/product", productRoutes);
app.use("/category", categoryRoutes);
app.use("/stats", statsRoutes);
app.use("/reclamation",reclamationRoutes );

app.post("/upload", uploader.single("image"), async (req, res) => {
  const upload = await cloudinary.v2.uploader.upload(req.file.path);
  return res.json({
    success: true,
    file: upload.secure_url,
  });
});

//MongoDB setup
connectDB();
const PORT = process.env.PORT || 9092;

io.on('connection', (socket) => {
  console.log('Client connecté');
  socket.on('hello', (data) => {
    console.log(`Message reçu : ${data}`);
    // Envoi du message "hello" à tous les clients connectés
    io.emit('hello', data);
  });
});

server.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));

// socket.io connection



app.get("/", (req, res) => {
  
  res.send("Welcome to BACKAPPX");
});
