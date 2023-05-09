const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/dbConnect");
const http = require("http");
const messageController = require("./controllers/messageController");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

//Routes declaration
const userRoutes = require("./routes/user.js");
const projectRoutes = require("./routes/projectroutes.js");
const clientRoutes = require("./routes/clientRoutes.js");
const categoryRoutes = require("./routes/categoryRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const statsRoutes = require("./routes/statRoutes.js");
const reclamationRoutes = require("./routes/reclamationRoutes");
const paymeeRoutes = require("./routes/paymentService");
const stripeRoutes = require("./routes/stripe");
const emailServiceRoutes = require("./routes/emailService");

//Upload Image
const cloudinary = require("./uploads/cloudinary");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

//Mailing Service jobs
const mailingService = require("./services/mailingScheduler");
mailingService;

//Basic Configuration
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methode: ["GET", "POST"],
  },
});

//Swagger UI Documentation
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "BACKAPPX API",
      version: "0.1.0",
      description: "BACKAPPX API Documentation",
    },
    contact: {
      name: "BACKAPPX",
      email: "back.app.x@gmail.com",
    },
    servers: [
      {
        url: "http://localhost:9092",
        description: "Development server",
      },
    ],
  },
  apis: ["./routes/*.js"],
};
const specs = swaggerJsDoc(options);

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use(cors()); // Add CORS headers

//Routes path
app.use("/user", userRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));
app.use("/payment", stripeRoutes);
app.use("/project", projectRoutes);
app.use("/client", clientRoutes);
app.use("/product", productRoutes);
app.use("/category", categoryRoutes);
app.use("/order", orderRoutes);
app.use("/paymentService", paymeeRoutes);
app.use("/email", emailServiceRoutes);
app.use("/stats", statsRoutes);
app.use("/reclamation", reclamationRoutes);

// Upload Image
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    format: async (req, file) => "png",
    public_id: (req, file) => "computed-filename-using-request",
  },
});
const upload = multer({ storage: storage });

app.post("/upload", upload.single("image"), async (req, res) => {
  const uploadResult = await cloudinary.uploader.upload(req.file.path);

  return res.json({
    success: true,
    file: uploadResult.secure_url,
  });
});

// MongoDB setup
connectDB();

const PORT = process.env.PORT || 9092;

io.on("connection", (socket) => {
  console.log("Client connecté");
  socket.on("hello", (data) => {
    console.log(`Message reçu : ${data}`);
    // Envoi du message "hello" à tous les clients connectés
    io.emit("hello", data);
  });

  socket.on("message", (message) => {
    messageController.send(message);
    io.emit("message", message);
    console.log("message sent!");
  });
});

// Start the server
server.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));

// Define a default route handler
app.get("/", (req, res) => {
  res.send("Welcome to BACKAPPX");
});