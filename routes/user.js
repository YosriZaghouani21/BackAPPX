const express = require("express");
const { registerRules, validator } = require("../middlewares/validator.js");

const jwt = require("jsonwebtoken");
const _ = require("lodash");
const config = require("config");
const secretOrkey = config.get("secretOrkey");

const isAuth = require("../middlewares/passport-setup.js");
const {
  register,
  login,
  authorizeRoles,
  updateUser,
  deleteUser,
  allUsers,
  userData,
  getSingleUser,
  addMyProject,
  forgotPassword,
  resetPassword,
  uploadphoto,
  blockUser,
  updateUserSubscription,
  uploadImage,
  getImage,
  updateUserGitCredentials
} = require("../controllers/user.js");


// Upload Image

const multer = require("multer");
const fs = require("fs");

const Router = express.Router();
const path = require("path");
Router.post("/register", registerRules(), validator, register);
Router.post("/login", login, authorizeRoles);
Router.put("/profile/:id", updateUser);
Router.put("/profileGit/:id", updateUserGitCredentials);

Router.delete("/delete/:id", deleteUser);
Router.put("/forgot-password", forgotPassword);
Router.post("/userData", userData);
Router.put("/reset-password", resetPassword);

Router.get("/users", allUsers);
Router.get("/user/:id", getSingleUser);
Router.get("/current", isAuth(), (req, res) => {
  console.log("req", req);
  res.json(req.user);
});
Router.put("/myProject/:id", addMyProject);


// ************************************************************** GIT STRATEGY **************************************************************
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const GitLabStrategy = require('passport-gitlab2').Strategy;
const User = require ('../models/User');

const router = express.Router();
require('dotenv').config();

passport.use(
  new GitHubStrategy(
      {
          clientID: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          callbackURL: "/user/github/callback"
      },
      async(accessToken,refreshToken,profile,cb)=>{
          const user = await User.findOne({
              gitId: profile.id,
              provider:'github'
          });
          if(!user){
              console.log('Adding new github user to DB..');
              const newUser = new User({
                  gitId: profile._json.id,
                  name: profile._json.login,
                  email: profile._json.email,
                  image: profile._json.avatar_url,
                  githubUsername:profile._json.login,
                  provider:'github'
              });
              await newUser.save();
              return cb(null,newUser);
          }else{
              console.log('Github user already exist in DB..');
              return cb(null,user);
          } 
      }
    
  )
) 
passport.use(
  new GitLabStrategy(
      {
          clientID: process.env.GITLAB_CLIENT_ID,
          clientSecret: process.env.GITLAB_CLIENT_SECRET,
          callbackURL: "/user/gitlab/callback"
      },
      async(accessToken,refreshToken,profile,cb)=>{

          const user = await User.findOne({
              gitId: profile.id,
              provider:'gitlab'
          });
          if(!user){
              console.log('Adding new gitlab user to DB..');
              const newUser = new User({
                  gitId: profile._json.id,
                  name: profile._json.username,
                  email: profile._json.commit_email,
                  image: profile._json.avatar_url,
                  provider:'gitlab'
              });
              await newUser.save();
              return cb(null,newUser);
          }else{
              console.log('Gitlab user already exist in DB..');
              return cb(null,user);
          }
      }
    
  )
) 

 // Serialize and deserialize user for session storage
 passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  User.findById(user._id, (err, user) => {
    done(err, user);
  });
});
//************************************************************** GIT STRATEGY END **************************************************************
//************************************************************** GIT AUTH **************************************************************
const CLIENT_URL = "http://localhost:3000/";
var token =""
var provider=""
var firstLogin = false 

Router.get("/login/success", (req, res) => {
  if (token !=""){
    res.status(200).json({
      success: true,
      message: "ok",
      token: token,
      provider:provider,
      firstLogin:firstLogin
    });
  }else{
    res.status(401).json({
      success: false,
      message: "not ok"
    });
  }
});

Router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

// Route for logging out
Router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

Router.get('/dashboard', function(req, res) {
  if (!req.user) {
    // User is not authenticated, send an error response
    res.status(401).json({ message: 'Unauthorized' });
  } else {
    // User is authenticated, send the user object as a JSON response
    res.json({ user: req.user });
  }
});
Router.get("/github", passport.authenticate("github", { scope: ["profile"] }));

Router.get(
  "/github/callback",
  passport.authenticate("github", {
//    successRedirect:CLIENT_URL,
    failureRedirect: "/login/failed",
  }),async function(req,res){
    try {
    console.log(req.user.name);
/*     req.session.user = {
      id: req.user._id,
      username: req.user.name,
    }; */

    const payload = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      image: req.user.image,
      githubUsername:req.user.githubUsername
    };
    
    token = await jwt.sign(payload, secretOrkey);
    provider = req.user.provider
    
    if (req.user.email == null){
      firstLogin = true
    }  else{
      firstLogin = false
    }
  

    res.redirect(`${CLIENT_URL}loading`)
  } catch (error) {
    res.status(500).json({ errors: error.message });
  }
  }
);



Router.get("/gitlab", passport.authenticate("gitlab", { scope: ["profile"] }));

Router.get(
  "/gitlab/callback",
  passport.authenticate("gitlab", {
/*     successRedirect:CLIENT_URL,
 */    failureRedirect: "/login/failed",
  }),async function(req,res){
    try {


    const payload = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      image: req.user.image,
    };

    token = await jwt.sign(payload, secretOrkey);
    provider = "gitlab"
    res.redirect(`${CLIENT_URL}loading`)
  } catch (error) {
    res.status(500).json({ errors: error.message });
  }
  }
);

//************************************************************** GIT AUTH ENDS **************************************************************
const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    const userId = req.params.userId;
    const uploadDir = `./uploads/${userId}`;
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
/*   let filetype = "";
  let fileExtension = "";
  if (file.mimetype === "image/gif") {
    filetype = "image-";
    fileExtension = "gif";
  }
  if (file.mimetype === "image/png") {
    filetype = "image-";
    fileExtension = "png";
  }
  if (file.mimetype === "image/jpeg") {
    filetype = "image-";
    fileExtension = "jpeg";
  }
  if (file.mimetype === "application/pdf") {
    filetype = "pdf-";
    fileExtension = "pdf";
  }

  cb(null, filetype + Date.now() + "." + fileExtension);
  h = cb;
*/

  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb({ message: "Unsupported File Format" }, false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 },
  fileFilter: fileFilter,
});

/* Router.post("/upload/:userId", upload.single("file"), (req, res) => {
  const { userId } = req.params;
  // Use userId here
}); */
Router.put("/upload/:userId", upload.single("file"), uploadImage);
Router.get("/image/:userId/:imageName", getImage);


Router.put("/blockUser", blockUser);
Router.put("/update-subscription", updateUserSubscription);

module.exports = Router;





//----------------------------------------------------------------------//
//------------------------- Swagger Documentation ----------------------//
//----------------------------------------------------------------------//

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The user's email
 *         phoneNumber:
 *           type: Number
 *           description: The user's phone number
 *         password:
 *           type: string
 *           description: The user's password
 *         createdAt:
 *           type: Date
 *           description: The user's creation date
 *           default: new Date()
 *         image:
 *           type: string
 *           description: The user's image
 *         role:
 *           type: string
 *           description: The user's role
 *           default: "User"
 *         Fonction:
 *           type: string
 *           description: The user's fonction
 *           default: ""
 *         myProjects:
 *           type: array
 *           description: The user's projects
 *           default: []
 *         resetLink:
 *           type: string
 *           description: The user's reset link
 *           default: ""
 *         startedAt:
 *           type: Date
 *           description: The user's subscription start date
 *           default: new Date()
 *         endedAt:
 *           type: Date
 *           description: The user's subscription end date
 *           default: new Date().setMonth( new Date().getMonth() + 12)
 *         subscription:
 *           type: String
 *           description: The user's subscription type
 *           default: "Free"
 *
 *       example:
 *         id: 5f5a64d471c4360017c2e1f3
 *         name: John Doe
 *         email: JohnDoe@email.com
 *         phoneNumber: 21345678
 *         password: chnageMe
 *         createdAt: 2020-03-10T04:05:06.157Z
 *         image: https://res.cloudinary.com/dzcmadjl1/image/upload/v1600000000/sample.jpg
 *         role: user
 *         Fonction: developer
 *         myProjects: []
 *         resetLink: ""
 *         startedAt: "2020-03-10T04:05:06.157Z"
 *         endedAt: "2021-03-10T04:05:06.157Z"
 *         subscription: free
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The Users management API
 * /user/users :
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:  integer
 *                       name: string
 *                       email: string
 *                       password: string
 *                       role: string
 *                       createdAt: string
 *                       updatedAt: string
 *                       deletedAt: string
 *                       projects: array
 *                       profileImage: string
 *                       subscription: string
 *
 *
 *
 * /user/user/{id}:
 *   get:
 *     summary: Retrieve a single user
 *     description: Retrieve a single user.
 *     tags:
 *       - Users
 *
 *
 * /user/register:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user.
 *     tags:
 *       - Users
 *
 *
 * /user/login:
 *   post:
 *     summary: Login a user
 *     description: Login a user.
 *     tags:
 *       - Users
 *
 *
 * /user/profile/{id}:
 *   put:
 *     summary: Update a user
 *     description: Update a user.
 *     tags:
 *       - Users
 *
 * /user/delete/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Delete a user.
 *     tags:
 *       - Users
 *
 *
 * /user/forgot-password:
 *   put:
 *     summary: Forgot password
 *     description: Forgot password.
 *     tags:
 *       - Users
 *
 * /user/reset-password:
 *   put:
 *     summary: Reset password
 *     description: Reset password.
 *     tags:
 *       - Users
 *
 * /user/userData:
 *   post:
 *     summary: Get user data
 *     description: Get user data.
 *     tags:
 *       - Users
 *
 *
 * /user/current:
 *   get:
 *     summary: Get current user
 *     description: Get current user.
 *     tags:
 *       - Users
 *
 * /user/myProject/{id}:
 *   put:
 *     summary: Add a project to user
 *     description: Add a project to user.
 *     tags:
 *       - Users
 *
 * /user/uploadphoto/{id}:
 *   put:
 *     summary: Upload a photo
 *     description: Upload a photo.
 *     tags:
 *       - Users
 *
 */