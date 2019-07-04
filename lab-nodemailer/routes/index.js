const express = require('express');
// const nodemailer = require('nodemailer'); // NEW
const router  = express.Router();

// let transporter = nodemailer.createTransport({
//   service: 'Gmail',
//   auth: {
//     user: process.env.GMAIL_USER,
//     pass: process.env.GMAIL_PASS 
//   }
// });

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

// router.post('/signup', (req, res, next) => {
//   //TODO: send an email
//   let email = req.body.email;
//   transporter.sendMail({
    
//     from: '"Your confirmation code" <yourcode@ironhack.com>',
//     to: email, 
//     text: `Your confirmation code is ${confirmationCode}. <br> Go to the following link to insert your code <br> http://localhost:3000/auth/confirm/THE-CONFIRMATION-CODE-OF-THE-USER`,
//     html: '<b>' + `Your confirmation code is ${confirmationCode}.` <br> `Go to the following link to insert your code` <br> `http://localhost:3000/auth/confirm/THE-CONFIRMATION-CODE-OF-THE-USER` + '</b>'
//   })
//   // This is a promise, you can add '.then'
//   .then(info => {
//     console.log("info", info)
//     res.render('message', { email })
//   })
//   .catch(console.log)
// });

module.exports = router;
