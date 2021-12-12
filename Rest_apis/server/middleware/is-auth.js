const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const err = new Error("Not authenticated!");
    err.statusCode = 401;
    throw err;
  }
  const token = authHeader.split(" ")[1];
  let decodeToken;
  try {
    decodeToken = jwt.verify(token, "leminhungg");
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }
  console.log("[decodeToken--]", decodeToken);
  if (!decodeToken) {
    const err = new Error("Not authenticated!");
    err.statusCode = 401;
    throw err;
  }
  req.userId = decodeToken.userId;
  next();
};
