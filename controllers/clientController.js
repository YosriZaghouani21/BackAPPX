const Client = require("../models/clientModel.js");
const Session = require("../models/sessionModel.js");
const Project = require("../models/projectModel.js");
const nodemailer = require("nodemailer");
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
   
    //Project.find
    

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
        user: process.env.ACCOUNT_EMAIL, // generated ethereal user
        pass: process.env.ACCOUNT_PASSWORD, // generated ethereal password
      },
      tls: { rejectUnothorized: false },
    });

    // send mail with defined transport object
  let info = await transporter.sendMail({
      from: 'BackAppX', // sender address
    to: email, // list of receivers
    subject: "Welcome ✔", // Subject line
    text: "Welcome"+fullName, // plain text body
    html:`<html>
    <head>
    
      <meta charset="utf-8">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <title>Welcome Email</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style type="text/css">
      /**
       * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
       */
      @media screen {
        @font-face {
          font-family: 'Source Sans Pro';
          font-style: normal;
          font-weight: 400;
          src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
        }
    
        @font-face {
          font-family: 'Source Sans Pro';
          font-style: normal;
          font-weight: 700;
          src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
        }
      }
    
      /**
       * Avoid browser level font resizing.
       * 1. Windows Mobile
       * 2. iOS / OSX
       */
      body,
      table,
      td,
      a {
        -ms-text-size-adjust: 100%; /* 1 */
        -webkit-text-size-adjust: 100%; /* 2 */
      }
    
      /**
       * Remove extra space added to tables and cells in Outlook.
       */
      table,
      td {
        mso-table-rspace: 0pt;
        mso-table-lspace: 0pt;
      }
    
      /**
       * Better fluid images in Internet Explorer.
       */
      img {
        -ms-interpolation-mode: bicubic;
      }
    
      /**
       * Remove blue links for iOS devices.
       */
      a[x-apple-data-detectors] {
        font-family: inherit !important;
        font-size: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
        color: inherit !important;
        text-decoration: none !important;
      }
    
      /**
       * Fix centering issues in Android 4.4.
       */
      div[style*="margin: 16px 0;"] {
        margin: 0 !important;
      }
    
      body {
        width: 100% !important;
        height: 100% !important;
        padding: 0 !important;
        margin: 0 !important;
      }
    
      /**
       * Collapse table borders to avoid space between cells.
       */
      table {
        border-collapse: collapse !important;
      }
    
      a {
        color: black;
      }
    
      img {
        height: auto;
        line-height: 100%;
        text-decoration: none;
        border: 0;
        outline: none;
      }
      </style>
    
    </head>
    <body style="background-color: #e9ecef;">
    
      <!-- start preheader -->
      <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
        A preheader is the short summary text that follows the subject line when an email is viewed in the inbox.
      </div>
      <!-- end preheader -->
    
      <!-- start body -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
    
        <!-- start logo -->
        <tr>
          <td align="center" bgcolor="#e9ecef">
            <!--[if (gte mso 9)|(IE)]>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
            <tr>
            <td align="center" valign="top" width="600">
            <![endif]-->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
              <tr>
                <td align="center" valign="top" style="padding: 36px 24px;">
                  <a href="https://sendgrid.com" target="_blank" rel="noopener noreferrer" style="display: inline-block;">
                    <img src="./img/paste-logo-light@2x.png" alt="Logo" border="0" width="48" style="display: block; width: 48px; max-width: 48px; min-width: 48px;">
                  </a>
                </td>
              </tr>
            </table>
            <!--[if (gte mso 9)|(IE)]>
            </td>
            </tr>
            </table>
            <![endif]-->
          </td>
        </tr>
        <!-- end logo -->
    
        <!-- start hero -->
        <tr>
          <td align="center" bgcolor="#e9ecef">
            <!--[if (gte mso 9)|(IE)]>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
            <tr>
            <td align="center" valign="top" width="600">
            <![endif]-->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
              <tr>
                <td bgcolor="#ffffff" align="left">
                  <img src="./img/welcome-hero.jpg" alt="Welcome" width="600" style="display: block; width: 100%; max-width: 100%;">
                </td>
              </tr>
            </table>
            <!--[if (gte mso 9)|(IE)]>
            </td>
            </tr>
            </table>
            <![endif]-->
          </td>
        </tr>
        <!-- end hero -->
    
        <!-- start copy block -->
        <tr>
          <td align="center" bgcolor="#e9ecef">
            <!--[if (gte mso 9)|(IE)]>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
            <tr>
            <td align="center" valign="top" width="600">
            <![endif]-->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
    
              <!-- start copy -->
              <tr>
                <td bgcolor="#ffffff" align="left" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                  <h1 style="margin: 0 0 12px; font-size: 32px; font-weight: 400; line-height: 48px;">Welcome, `+fullName+
        `</h1>
                  <p style="margin: 0;">Thank you for signing up with Paste. We strive to produce high quality email templates that you can use for your transactional or marketing needs.</p>
                </td>
              </tr>
              <!-- end copy -->
    
              <!-- start button -->
              <tr>
                <td align="left" bgcolor="#ffffff">
                  
                </td>
              </tr>
              <!-- end button -->
    
              <!-- start copy -->
              <tr>
                <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                  <p style="margin: 0;">Cheers,<br> Paste</p>
                </td>
              </tr>
              <!-- end copy -->
    
            </table>
            <!--[if (gte mso 9)|(IE)]>
            </td>
            </tr>
            </table>
            <![endif]-->
          </td>
        </tr>
        <!-- end copy block -->
    
        <!-- start footer -->
        <tr>
          <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
            <!--[if (gte mso 9)|(IE)]>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
            <tr>
            <td align="center" valign="top" width="600">
            <![endif]-->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
    
              <!-- start permission -->
              <tr>
                <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                  <p style="margin: 0;">You received this email because we received a request for [type_of_action] for your account. If you didn't request [type_of_action] you can safely delete this email.</p>
                </td>
              </tr>
              <!-- end permission -->
    
              <!-- start unsubscribe -->
              <tr>
                <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                  <p style="margin: 0;">To stop receiving these emails, you can <a href="https://sendgrid.com" target="_blank" rel="noopener noreferrer">unsubscribe</a> at any time.</p>
                  <p style="margin: 0;">Paste 1234 S. Broadway St. City, State 12345</p>
                </td>
              </tr>
              <!-- end unsubscribe -->
    
            </table>
            <!--[if (gte mso 9)|(IE)]>
            </td>
            </tr>
            </table>
            <![endif]-->
          </td>
        </tr>
        <!-- end footer -->
    
      </table>
      <!-- end body -->
    
    </body>
    </html>`
//    html: "<b>Let's begin</b>", // html body
  });


  res.status(201).json({status:"created",newClient});
  } catch (error) {
    res.status(500).json({ errors: error });
  }
};



// Update client
exports.updateClient = async (req, res) => {
  try {
    const { name, familyName,fullName, email,phoneNumber,password,reference,image } = req.body;

    const updatedClient = await Client.findByIdAndUpdate(req.params.id, {
       name,
       familyName,
       fullName,
       email,
       phoneNumber,
       password,
       reference,
       image
    });

    return res.status(201).json({
      status:"updated",
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
    res.json({status:"deleted",msg: "client supprimé avec succès" });
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
    const updatedUser = await Client.findByIdAndUpdate(req.params.id, {
      image:image.secure_url,
    });
    res.json({
      success: true,
      file: image,
      user: updatedUser,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};



exports.forgotPassword = async (req, res) => {
  const user = await Client.findOne({email: req.body.email})

  if (user) {
      const randomNumber = Math.floor(100000 + Math.random() * 900000);
      const token = generateResetToken(randomNumber);

      const success = await sendEmail({
          from: process.env.ACCOUNT_EMAIL,
          to: req.body.email,
          subject: "Password reset - Code : " ,
          html:
              "<h3>You have requested to reset your password</h3><p>Your reset code is : <b style='color : #f822c6'>" +
              randomNumber +
              "</b></p>",
      }).catch((error) => {
          console.log(error)
          return res.status(500).send({
              message: "Error : email could not be sent"
          })
      });

      if (success) {
          console.log(token)
          return res.status(200).send({
              message: "Reset email has been sent to : " + user.email+"with code" +randomNumber,
              token: token
          })
      } else {
          return res.status(500).send({
              message: "Email could not be sent"
          })
      }
  } else {
      return res.status(404).send({message: "User does not exist"});
  }
};

exports.verifyResetCode = async (req, res) => {
  const {resetCode, token} = req.body;

  try {
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.resetCode !== resetCode) {
          return res.status(200).send({message: "Success"});
      } else {
          return res.status(403).send({message: "Invalid reset code"});
      }
  } catch (error) {
      return res.status(500).send({error});
  }
}

exports.resetPassword = async (req, res) => {
  const {
      email,
      password,
  } = req.body;

  try {
      await Client.findOneAndUpdate({email},
          {
              $set: {
                  password: await bcrypt.hash(password, 10),
              },
          }
      )
      res.status(200).send({message: "Success"});
  } catch (error) {
      res.status(500).send({error});
  }
}

function generateResetToken(resetCode) {
  return jwt.sign(
      {resetCode},
      process.env.JWT_SECRET, {
          expiresIn: "100000000", // in Milliseconds (3600000 = 1 hour)
      }, {}
  )
}

async function sendEmail(mailOptions) {
  let transporter = await nodemailer.createTransport({
      service: "gmail",
      auth: {
          user: process.env.ACCOUNT_EMAIL,
          pass: process.env.ACCOUNT_PASSWORD,
      },
  });

  await transporter.verify(function (error) {
      if (error) {
          console.log(error);
          console.log("Server not ready");
      } else {
          console.log("Server is ready to take our messages");
      }
  })

  await transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
          console.log(error);
          return false;
      } else {
          console.log("Email sent: " + info.response);
          return true;
      }
  });

  return true
}


exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Client.findOne({ email });
    if (!user)
      return res.status(404).json({status:"email not found", msg: `Email ou mot de passe incorrect` });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)

      return res.status(401).json({ status:"password not found", msg: `Email ou mot de passe incorrect` });

      if (!isSubValid(user))
      return res.status(401).json({ msg: `Votre abonnement a expiré` });

      let lastLogin = user.lastLogin;

      user.lastLogin = new Date();
      user.save();


    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      image: user.image,
      githubUsername:user.githubUsername,
      provider:user.provider,
      role:user.Role
    };

    const token = await jwt.sign(payload, secretOrkey);
    return res.status(200).json({ status:"ok",lastLogin:lastLogin,token:token, user });

  } catch (error) {
    res.status(500).json({ errors: error.message });
  }
};exports.loginclient = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Client.findOne({ email });
    if (!user)
      return res.status(404).json({status:"email not found", msg: `Email ou mot de passe incorrect` });
    const isMatch = (password, user.password);
    if (password != user.password)
      return res.status(401).json({ status:"password not found", msg: `Email ou mot de passe incorrect` });

    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    const token = await jwt.sign(payload, secretOrkey);
    return res.status(200).json({ status:"ok" });

  } catch (error) {
    res.status(500).json({ errors: error.message });
  }

};
exports.logoutclient = async (req, res) => {
  const { id, reference } = req.body;
  Session.findOneAndDelete({ userId: req.body.userId }, function (err) {
    if (err) {
      return res.status(500).json({ msg: err.message });
    } else {
      res.json({ msg: "logged out" });
    }
  })
};
exports.logoutclient = async (req, res) => {
  const { id, reference } = req.body;
  Session.findOneAndDelete({ userId: req.body.userId }, function (err) {
    if (err) {
      return res.status(500).json({ msg: err.message });
    } else {
      res.json({ msg: "logged out" });
    }
  })
};


