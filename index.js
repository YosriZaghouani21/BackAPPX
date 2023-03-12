 const express = require("express");

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/dbConnect");
const userRoutes = require("./routes/user.js");
const projectRoutes = require("./routes/projectroutes.js");
const clientRoutes = require("./routes/clientRoutes.js");
const paymeeRoutes = require("./routes/paymee");
const stripeRoutes = require("./routes/stripe");
const mailingService = require("./utils/mailingScheduler");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

//Upload Image
const cloudinary = require("./uploads/cloudinary");
const uploader = require("./uploads/multer");

//Mailing Service jobs
mailingService
//Basic Configuration
const app = express();
 //Swagger UI Documentation
 const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "BACKAPPX API",
      version: "0.1.0",
      description: "BACKAPPX API Documentation",
    },
    contact : {
      name : "BACKAPPX",
      email : "back.app.x@gmail.com"
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

 //Swagger UI Documentation
 const options = {
   definition: {
     openapi: "3.0.0",
     info: {
       title: "BACKAPPX API",
       version: "0.1.0",
       description: "BACKAPPX API Documentation",
     },
     contact : {
       name : "BACKAPPX",
       email : "back.app.x@gmail.com"
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




connectDB();
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());


//Routes path
app.use("/user", userRoutes);

app.use("/api-docs", swaggerUi.serve,
    swaggerUi.setup(specs,
        { explorer: true,
          customCssUrl:
              "https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-material.css",
        })
);
app.use("/payment", stripeRoutes);
app.use("/project", projectRoutes);
app.use("/client", clientRoutes);
app.use("/paymee", paymeeRoutes);
app.post("/upload", uploader.single("image"), async (req, res) => {
  const upload = await cloudinary.v2.uploader.upload(req.file.path);
  return res.json({
    success: true,
    file: upload.secure_url,
  });
});

app.post("/upload", uploader.single("image"), async (req, res) => {
  const upload = await cloudinary.v2.uploader.upload(req.file.path);
  return res.json({
    success: true,
    file: upload.secure_url,
  });
});


//MongoDB setup
const PORT = process.env.PORT || 9092;
app.listen(PORT, (err) =>
  err ? console.log(err) : console.log(`server is running on PORT ${PORT}`)
);




app.get("/", (req, res) => {
  res.send("Welcome to BACKAPPX");
});
