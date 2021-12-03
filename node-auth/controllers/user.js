const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { msgEnum } = require("../enum/message.enum");
const { codeEnum } = require("../enum/status-code.enum");

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
      await User.create({
        email,
        password: hash,
        role,
      });
      return res.json({ msg: msgEnum.SIGNUP_SUCCESS });
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
    bcrypt.compare(password, user.password, (err, check) => {
      if (!check) {
        return res
          .status(codeEnum.UNAUTHORIZED)
          .json({ msg: msgEnum.WRONG_PASSWORD });
      }
      req.session.user = user;
      req.session.isLoggedIn = true;
      return res.status(codeEnum.SUCCESS).json({ msg: msgEnum.LOGIN_SUCCESS });
    });
  },
};
