const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require('nodemailer'); // NEW

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS 
  }
});

router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  console.log("TCL1")
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let confirmationCode = 'we';
  for (let i = 0; i < 25; i++) {
      confirmationCode += characters[Math.floor(Math.random() * characters.length )];
  }

  if (username === "" || email === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username, email and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
console.log("TCL", username, email, password, confirmationCode);
    const newUser = new User({
      username,
      email,
      password: hashPass,
      confirmationCode
      
    });
    console.log("TCL2", newUser.username, newUser.email, newUser.password, newUser.confirmationCode);

    transporter.sendMail({
      from: '"Your confirmation code" <yourcode@ironhack.com>',
      to: email, 
      subject: "Your confirmation code",
      text: `Your confirmation code is ${confirmationCode}. <br> Go to the following link to insert your code <br> http://localhost:3000/auth/confirm/${confirmationCode}`,
      html: '<b>' + `Your confirmation code is ${confirmationCode}.` + `<br>` + `Go to the following link to insert your code ` + `<br>` + `http://localhost:3000/auth/confirm/${confirmationCode}` + '</b>'
    })

    newUser.save()
    .then(() => {
      res.redirect("/message");
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});

router.get("/confirm/:confirmCode", (req, res, next) => {
  let confirmUrl = req.params.confirmCode;
  console.log("TLC", confirmUrl);

  User.findOne({ confirmationCode: confirmUrl })
    .then(user => {
      console.log(user);
      res.render("auth/login");
      console.log("TCL", user.confirmationCode);
      user.status = "Active";
      console.log(user);
    })
    

  // let confirmationCodeUser = req.user.confirmationCode;
});



router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
