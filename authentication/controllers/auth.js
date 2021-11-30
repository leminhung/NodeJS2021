const bcrypt = require("bcryptjs");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) message = message[0];
  else message = null;
  console.log(message);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) message = message[0];
  else message = null;
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password!");
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          req.flash("error", "Invalid email or password!");

          res.redirect("/login");
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        req.flash("error", "Email is existing, try another!");
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((bcryptPassword) => {
          let newUser = new User({
            email,
            password: bcryptPassword,
            cart: { items: [] },
          });
          return newUser.save();
        })
        .then(() => {
          res.redirect("/login");
          return transporter.sendMail({
            to: email,
            from: "leminhhungtabletennis@gmail.com",
            subject: "Signup successfully",
            html: "<h1>You successfully sign up!<h1>",
          });
        })
        .catch((err) => console.log("loi xay ra"));
    })

    .catch((err) => console.log("co loi xay ra"));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
