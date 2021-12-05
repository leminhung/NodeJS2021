const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { msgEnum } = require("../enum/message.enum");
const { codeEnum } = require("../enum/status-code.enum");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "leminhhungtabletennis@gmail.com",
    pass: "password",
  },
});

module.exports = {
  postSignup: async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;
    let oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(codeEnum.EXISTING).json({ msg: msgEnum.MAIL_EXISTING });
    }
    bcrypt.hash(password, 12, async (err, hash) => {
      try {
        await User.create({
          email,
          password: hash,
          role,
        });
        let message = {
          from: `MinHungg`,
          to: email,
          subject: "Signup successfully",
          html: "<h1>You successfully sign up!<h1>",
        };
        await transporter.sendMail(message);
        return res
          .status(codeEnum.SUCCESS)
          .json({ msg: msgEnum.SIGNUP_SUCCESS });
      } catch (error) {
        console.log("[error--]", error);
      }
    });
  },
  postSignin: async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(codeEnum.NOT_FOUND)
        .json({ msg: msgEnum.USER_NOT_FOUND });
    }
    bcrypt.compare(password, user.password, async (err, check) => {
      if (!check) {
        return res
          .status(codeEnum.UNAUTHORIZED)
          .json({ msg: msgEnum.WRONG_PASSWORD });
      }
      req.session.user = user;
      req.session.isLoggedIn = true;
      await req.session.save();
      return res.status(codeEnum.SUCCESS).json({ msg: msgEnum.LOGIN_SUCCESS });
    });
  },
  postResetPassword: async (req, res, next) => {
    await crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        console.log("[err--]", err.message);
        return res
          .status(codeEnum.BAD_REQUEST)
          .json({ msg: msgEnum.RESET_PASSWORD_FAIL });
      }
      const email = req.body.email;
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return res
            .status(codeEnum.NOT_FOUND)
            .json({ msg: msgEnum.USER_NOT_FOUND });
        }

        // create token to send mail
        const token = buffer.toString("hex");
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        await user.save();

        // sent mail
        let message = {
          from: `MinHungg`,
          to: req.body.email,
          subject: "Password reset",
          html: `
            <p>Token: ${token}</p>
          `,
        };
        await transporter.sendMail(message);
        res.status(codeEnum.SUCCESS).json({ msg: msgEnum.MAIL_SENT });
      } catch (error) {
        console.log("[error--]", error);
      }
    });
  },
  postNewPassword: async (req, res, next) => {
    const userId = req.body.userId;
    const newPassword = req.body.newPassword;
    const token = req.body.token;
    const user = await User.findOne({
      _id: userId,
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(codeEnum.NOT_FOUND)
        .json({ msg: msgEnum.USER_NOT_FOUND });
    }
    await bcrypt.hash(newPassword, 12, async (err, hash) => {
      user.password = hash;
      user.resetToken = undefined;
      user.resetTokenExpiration = undefined;
      await user.save();
    });
    return res
      .status(codeEnum.SUCCESS)
      .json({ msg: msgEnum.RESET_PASSWORD_SUCCESS });
  },
};
