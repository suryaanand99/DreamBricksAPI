const User = require("../models/User");
const jwt = require("jsonwebtoken");

const userCheck = async (req, res, next) => {
  const user = req.user;
  try {
    if (user.userType === "client") {
      throw new Error("Unauthorized Access");
    }
    if (user.userType === "admin") {
      next();
    }
  } catch (err) {
    console.log(err.message);
    if (err.message === "Unauthorized Access") {
      return res.status(400).json({ statusCode: 400, message: err.message });
    }
    res.status(500).json({ statusCode: 500, message: "Server Error" });
  }
};
module.exports = userCheck;
