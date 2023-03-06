const schedule = require('node-schedule');
const User = require('../models/User');
const paymentController = require('../controllers/payment');
const today = new Date().getTime;
const userController = require('../controllers/user')

const mailingExpire = schedule.scheduleJob('*/1 * * * *', function(){
    User.find({}).then(users => {
        users.forEach(user => {
            if(user.endedAt.getTime() <= today ){
                userController.blockUser(user.email)
                paymentController.sendEmailAfterPayment(user.email,user.name)
            }
        })
    })
  });


  const mailingBeforeDays = schedule.scheduleJob('*/1 * * * *', function(){
    User.find({}).then(users => {
        users.forEach(user => {
            const days = parseInt((user.endedAt - new Date()) / (1000 * 60 * 60 * 24), 10); 
            if(days < 7 && days>0 && user.subscription !="Blocked"){
                
                paymentController.sendEmailBeforeExpirationDate(user.email,user.name)
            }
        })
    })
    
  });
