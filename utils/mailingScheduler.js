const schedule = require('node-schedule');
const User = require('../models/User');
const paymentController = require('../controllers/payment');
const today = new Date().getTime();
const userController = require('../controllers/user')

const mailingExpire = schedule.scheduleJob('0 0 * * *', function(){
    User.find().then(users => {
        users.forEach(user => {
            if(user.subscription !== "Blocked" && user.endedAt.getTime() < today){
                paymentController.sendEmailAfterExpirationDate(user.email,user.name)
                userController.blockUser(user.email)

            }
        })
    })
  });


  const mailingBeforeDays = schedule.scheduleJob('0 0 * * *', function(){
    User.find().then(users => {
        users.forEach(user => {
            const days = parseInt((user.endedAt - new Date()) / (1000 * 60 * 60 * 24), 10); 
            if(days === 7 && user.subscription !=="Blocked"){
                paymentController.sendEmailBeforeExpirationDate(user.email,user.name)
            }
        })
    })
  });

