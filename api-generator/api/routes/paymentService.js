const express = require('express');
const router = express.Router();
const paymentService = require('../controllers/stripePaymentService');


router.get('/', paymentService.getAllPayments);
router.post('/pay', paymentService.createPaymentIntent);

module.exports = router;

//----------------------------------------------------------------------//
//------------------------- Swagger Documentation ----------------------//
//----------------------------------------------------------------------//
/**
 * @swagger
 * tags:
 *   name: Paymee
 *   description: The Paymee management API
 * /paymee/check :
 *   get:
 *     summary: Retrieve paymee key
 *     description: Retrieve paymee public key.
 *     tags:
 *       - Paymee
 *
 *
 *
 *
 *
 *
 * /paymee/create:
 *   post:
 *     summary: Create paymee payment intent
 *     description: Create paymee payment intent.
 *     tags:
 *       - Paymee
 *
 */