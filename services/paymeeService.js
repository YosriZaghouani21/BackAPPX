const router = require('express').Router();
const paymeeKey = process.env.PAYMEE_KEY;

router.get('/', (req, res) => {
    res.send(paymeeKey);
});
router.post('/checkout', (req, res) => {
    const {firstName, lastName, email, amount, currency, phone, note,returnUrl,cancelUrl,webhookUrl} = req.body;
    const paymee = require('paymee');
    const paymeeClient = new paymee.Client(paymeeKey);
    paymeeClient.checkout.create({
        firstName,
        lastName,
        email,
        amount,
        currency,
        phone,
        note,
        returnUrl,
        cancelUrl,
        webhookUrl
    }).then((response) => {
        res.send(response);
    }).catch((error) => {
        console.log(error);
    });
});

module.exports = router;