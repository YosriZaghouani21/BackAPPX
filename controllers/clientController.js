const Client = require("../models/clientModel.js");
const nodemailer = require("nodemailer");
const { json } = require("body-parser");
const bcrypt = require("bcryptjs");
const cloudinary = require("../uploads/cloudinary");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const config = require("config");
const secretOrkey = config.get("secretOrkey");
const RESET_PWD_KEY = config.get("RESET_PWD_KEY");
const Client_URL = config.get("Client_URL");

// create client
exports.createClient = async (req, res) => {
  const { name, familyName,email,phoneNumber,reference,password } = req.body;
  
  const fullName = name +" "+familyName;
  try {

    const searchRes = await Client.findOne({ email,reference });
    if (searchRes)
      return res
        .status(401)
        .json({ msg: `Utilisateur existant , utiliser un autre E-mail` });
    const newClient = new Client({
      name,
      familyName,
      fullName,
      email,
      phoneNumber,
      password,
      reference
    });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    newClient.password = hash;
   
    

    const data = {
      fullName: fullName,
    };
   

    await newClient.save();
    

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "zaghouani.yosri@gmail.com", // generated ethereal user
        pass: "yimktgkvxvbbylzp", // generated ethereal password
      },
      tls: { rejectUnothorized: false },
    });

    // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Node mailer contact" <zaghouani.yosri@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Welcome ✔", // Subject line
    text: "Welecome"+fullName, // plain text body
    html: "<b>Let's begin</b>", // html body
  });

  res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({ errors: error });
  }
};



// Update client
exports.updateClient = async (req, res) => {
  try {
    const { name, familyName, email,phoneNumber,password,reference,image } = req.body;

    const updatedClient = await Client.findByIdAndUpdate(req.params.id, {
      name,
       familyName,
       email,
       phoneNumber,
       password,
       reference,
       image
    });

    return res.status(201).json({
      msg: "Le client a été modifié avec succès",
      user: updatedClient,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }

};

// Get all clients
exports.allClients = async (req, res) => {
    Client.find({})
    .then(docs =>{
    res.status(200).json(docs)
   })
   .catch(err => {
    res.status(500).json({error:err})
   }) 
};

exports.allClientsByProjectReference = async (req, res) => {
    Client.find({"reference":req.params.reference})
    .then(doc => {
        res.status(200).json(doc)
    })
    .catch(err => {
        res.status(500).json({error : err})
    })
};
//Delete a client 
exports.deleteClient = async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.json({ msg: "client supprimé avec succès" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

//Get Client with id
exports.getSingleClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    res.status(200).json({client});
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};


exports.uploadPhotoToClient = async (req, res) => {
  try {
    const image = await cloudinary.v2.uploader.upload(req.file.path);
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      image,
    });
    res.json({
      success: true,
      file: image.secure_url,
      user: updatedUser,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};



exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const client = await Client.findOne({ email });
    if (!client) {
      return res
        .status(400)
        .json({ error: "client with this email does not exist" });
    }

    const token = jwt.sign({ _id: client._id }, RESET_PWD_KEY, {
      expiresIn: "20m",
    });

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "zaghouani.yosri@gmail.com", // generated ethereal user
        pass: "yimktgkvxvbbylzp", // generated ethereal password
      },
      tls: { rejectUnauthorized: false },
    });

    let info = await transporter.sendMail({
      from: "noreplybackappX@backapp.com",
      to: email,
      subject: "Hello ✔",
      text: "Account Activation link",
      html: `<h2>Please click on given link to reset your account</h2>
      <link><p>${Client_URL}/resetpassword/${token}</p></link>`,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    console.log("email has been sent");

    await client.updateOne({ resetLink: token });

    return res.status(200).json({
      message: "Email has been sent, kindly activate your account",
      token,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};


exports.clientresetPassword = async (req, res) => {
  const { resetLink, newPass } = req.body;
  if (resetLink && typeof resetLink === "string") {
    jwt.verify(resetLink, RESET_PWD_KEY, function (err, decodedData) {
      if (err) {
        return res.status(401).json({ err: "Incorrect token/expired" });
      }
      Client.findOne({ resetLink }, async (err, client) => {
        if (err || !client) {
          return res
            .status(400)
            .json({ error: "client with this token does not exist" });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPass, salt);
        client.password = hash;
        client.resetLink = "";

        client.save((err, result) => {
          if (err) {
            return res.status(400).json({ error: "reset password error" });
          } else {
            return res.status(200).json({
              message: "Your password has been changed",
            });
          }
        });
      });
    });
  } else {
    return res.status(401).json({ error: "Invalid or missing reset link" });
  }
};


exports.loginclient = async (req, res) => {
  const { email, password } = req.body;
  try {
    const client = await Client.findOne({ email });
    if (!client)
      return res.status(404).json({ msg: `Email incorrect` });
    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch)
      return res.status(401).json({ msg: `Email ou mot de passe incorrect` });
   else{
    const payload = {
      id: client._id,
      name: client.name,
      email: client.email,
      phoneNumber: client.phoneNumber,
    };
  
    const token = await jwt.sign(payload, secretOrkey);
      return res.status(200).json({ token: `Bearer ${token}`, client });
   }
   
  } catch (error) {
    res.status(500).json({ errors: error });
  }
};

