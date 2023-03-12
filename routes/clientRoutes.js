//---------------------------------------------------------------------------------------------//
//--------------------------------- Swagger Documentation -------------------------------------//
//---------------------------------------------------------------------------------------------//








const express = require("express");

const { registerRules, validator } = require("../middlewares/validator.js");
const isAuth = require("../middlewares/passport-setup.js");
const {
    createClient
} = require("../controllers/clientController.js");
//const isAuth = require("../middleware/passport-setup.js");

const Router = express.Router();

Router.post("/client", createClient);

module.exports = Router;


//----------------------------------------------------------------------//
//------------------------- Swagger Documentation ----------------------//
//----------------------------------------------------------------------//


/**
 * @swagger
 * components:
 *   schemas:
 *     Client:
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
 *         familyName:
 *           type: string
 *           description: The user's family name
 *         fullName:
 *           type: string
 *           description: The user's full name
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
 *         reference:
 *           type: string
 *           description: The user's role
 *
 *       example:
 *         id: 5f5a64d471c4360017c2e1f3
 *         name: John
 *         familyName: Doe
 *         fullName: John Doe
 *         email: JohnDoe@email.com
 *         phoneNumber: 21345678
 *         password: chnageMe
 *         image: https://res.cloudinary.com/dzcmadjl1/image/upload/v1600000000/sample.jpg
 *         reference: 5f5a64d471c4360017c2e1f3
 *         createdAt: 2020-03-10T04:05:06.157Z

 */




/**
 * @swagger
 * tags:
 *   name: Client
 *   description: The Client management API
 * /client :
 *   post:
 *     summary: Create a new client
 *     description: Create a new client
 *     tags:
 *       - Client
 *
 */
