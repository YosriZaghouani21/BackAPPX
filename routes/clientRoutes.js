//---------------------------------------------------------------------------------------------//
//--------------------------------- Swagger Documentation -------------------------------------//
//---------------------------------------------------------------------------------------------//








const express = require("express");

const { registerRules, validator } = require("../middlewares/validator.js");
const isAuth = require("../middlewares/passport-setup.js");

const upload = require("../uploads/multer");
const client = require("../controllers/clientController.js");
//const isAuth = require("../middleware/passport-setup.js");

const Router = express.Router();

Router.post("/client", client.createClient);
Router.get("/client", client.allClients);
Router.delete("/client/:id", client.deleteClient);
Router.put("/client/:id", client.updateClient);
Router.put("/clientresetpassword", client.forgotPassword);
Router.post("/clientVerifyKey", client.verifyResetCode);
Router.put("/resetPassowrd", client.resetPassword);
Router.get("/client/:reference", client.allClientsByProjectReference);
Router.get("/clientbyid/:id", client.getSingleClient);
Router.put("/uploadPhotoClient/:id",  upload.single("image"), client.uploadPhotoToClient);
Router.post("/login", client.loginclient);


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
 *           description: The auto-generated id of the client
 *         name:
 *           type: string
 *           description: The name of the client
 *         familyName:
 *           type: string
 *           description: The client's family name
 *         fullName:
 *           type: string
 *           description: The client's full name
 *         email:
 *           type: string
 *           description: The client's email
 *         phoneNumber:
 *           type: Number
 *           description: The client's phone number
 *         password:
 *           type: string
 *           description: The client's password
 *         createdAt:
 *           type: Date
 *           description: The client's creation date
 *           default: new Date()
 *         image:
 *           type: string
 *           description: The client's image
 *         reference:
 *           type: string
 *           description: The client's role
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
 *   name: Clients
 *   description: The Clients management API
 * /clients:
 *   get:
 *     summary: Lists all the Clients
 *     tags: [Clients]
 *     responses:
 *       200:
 *         description: The list of the Clients.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Client'
 * /clients/{id}:
 *   get:
 *     summary: Get the client by id
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The client id
 *     responses:
 *       200:
 *         description: The client response by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       404:
 *         description: The client was not found
 *   post:
 *     summary: Create a new client
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Client'
 *     responses:
 *       200:
 *         description: The created client.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       500:
 *         description: Some server error
 *   put:
 *    summary: Update the client by the id
 *    tags: [Clients]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The client id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Client'
 *    responses:
 *      200:
 *        description: The client was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Client'
 *      404:
 *        description: The client was not found
 *      500:
 *        description: Some error happened
 *   delete:
 *     summary: Remove the client by id
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The client id
 *
 *     responses:
 *       200:
 *         description: The client was deleted
 *       404:
 *         description: The client was not found
 */