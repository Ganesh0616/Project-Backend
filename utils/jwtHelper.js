const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET;
const generatetoken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, {
    expiresIn: "7d",
  });
};
const verifytoken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return null;
  }
};
module.exports = { generatetoken, verifytoken };
