const Property = require("../models/property");

const viewProperty = async (req, res, next) => {
  try {
    const user = req.user;
    let property;
    if (user.userType === "client") {
      property = await Property.find({ eligible: "Eligible" });
    } else if (user.userType === "admin") {
      property = await Property.find();
    }
    if (!property) {
      throw new Error("no properties exists");
    }
    req.property = property;
    next();
  } catch (err) {
    console.log(err.message);
    if (err.message === "no properties exists") {
      return res.status(400).json({ statusCode: 400, message: err.message });
    }
    res.status(500).json({ statusCode: 500, message: "Server Error" });
  }
};

module.exports = viewProperty;
