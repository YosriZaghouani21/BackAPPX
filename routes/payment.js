const paymentController = require('../controllers/payment')
const router = require('express').Router()
require('dotenv').config()

// // @route   GET /payment
router.get('/', async (req, res) => {
    res.render('payment', { key: process.env.STRIPE_PUBLISHABLE_KEY })
})
// // @route   POST /payment/charge
router.post('/charge', paymentController.createCustomerThenCharge)
// // @route   GET /payment/success
router.get('/success', paymentController.success)
// // @route   GET /payment/cancel
router.get('/cancel', paymentController.cancel)
// // @route   GET /payment/error
router.get('/error', paymentController.error)

module.exports = router
