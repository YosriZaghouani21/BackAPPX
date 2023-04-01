const schedule = require('node-schedule');
const User = require('../models/User');
const Email = require('../models/email');
const paymentController = require('../controllers/paymentsMailing');
const today = new Date().getTime();
const userController = require('../controllers/user')
const mailingService = require('../controllers/emailServiceController')

// mailingExpire
const mailingExpire = schedule.scheduleJob('0 0 * * *', async function(){
    const users = await User.find();
    for (const user of users) {
        if(user.subscription !== "Blocked" && user.endedAt.getTime() < today){
            await paymentController.sendEmailAfterExpirationDate(user.email, user.name);
            await userController.blockUser(user.email);
        }
    }
});
// subscriptionReminderJob
const subscriptionReminderJob = schedule.scheduleJob('0 0 * * *', async function(){
    try {
        const users = await User.find();
        for (const user of users) {
            const days = parseInt((user.endedAt - new Date()) / (1000 * 60 * 60 * 24), 10);
            if(days === 7 && user.subscription !== "Blocked"){
                await paymentController.sendEmailBeforeExpirationDate(user.email, user.name);
            }
        }
    } catch (error) {
        console.error('Error occurred while sending subscription reminder emails:', error);
    }
});

// mailingServiceJob
const mailingServiceJob = schedule.scheduleJob("*/1 * * * *", async function() {
    try {
        const now = new Date().getTime();
        const emails = await Email.find({ scheduleTime: { $lt: now } })
            .sort({ scheduleTime: 'asc' })
            .limit(100);

        for (const email of emails) {
            await mailingService.sendScheduledEmail(email._id);
            await Email.findByIdAndDelete(email._id);
            console.log(`Sent scheduled email ${email._id}`);
        }

        if (emails.length > 0) {
            console.log(`Sent ${emails.length} scheduled emails`);
        }
    } catch (error) {
        console.error('Error occurred while sending scheduled emails:', error);
    }
});
