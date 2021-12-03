const { msgEnum } = require("../enum/message.enum");
const { codeEnum } = require("../enum/status-code.enum");
module.exports = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res
    .status(codeEnum.UNAUTHORIZED)
    .json({ msg: "Cần đăng nhập để thực hiện chức năng" });
};
