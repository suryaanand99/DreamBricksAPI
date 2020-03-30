const Property = require("../models/property");

module.exports = {
  addProperty: async (req, res) => {
    try {
      const {
        propertyType,
        name,
        bhk,
        area,
        cost,
        address,
        loaction,
        details,
        img
      } = req.body;
      let user = req.user;
      let property = await Property.findOne({ name });

      //check for existing property
      if (property) {
        throw new Error("Property exists");
      }

      property = await Property.create({
        propertyType,
        name,
        bhk,
        area,
        cost,
        address,
        loaction,
        details,
        img
      });
      property.soldBy = user._id;
      property = await property.save();

      //save the details to user document
      user.posted.push(property._id);
      user = await user.save();

      res.status(201).json({ statusCode: 201, property, user });
    } catch (err) {
      console.log(err.message);
      if (err.message === "Property exists") {
        return res.status(400).json({ statusCode: 400, message: err.message });
      }
      res.status(500).json({ statusCode: 500, message: "Server Error" });
    }
  },

  home: (req, res) => {
    try {
      const { user, property } = req;
      res.status(200).json({ statusCode: 200, property, user });
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ statusCode: 500, message: "Server Error" });
    }
  },

  searchByName: (req, res) => {
    try {
      const name = req.params.name;
      let { user, property } = req;
      property = property.find(propertyObj => propertyObj.name === name);
      if (!property) {
        throw new Error("property does not exists");
      }
      res.status(200).json({ statusCode: 200, property, user });
    } catch (err) {
      console.log(err.message);
      if (err.message === "property does not exists") {
        return res.status(400).json({ statusCode: 400, message: err.message });
      }
      res.status(500).json({ statusCode: 500, message: "Server Error" });
    }
  },

  deleteProperty: async (req, res) => {
    try {
      const user = req.user;
      const name = req.params.name;
      const property = await Property.deleteOne({ name });
      if (!property) {
        throw new Error("property does not exist");
      }
      res.status(202).json({ statusCode: 201, property, user });
    } catch (err) {
      console.log(err.message);
      if (err.message === "property does not exist") {
        return res.status(400).json({ statusCode: 400, message: err.message });
      }
      res.status(500).json({ statusCode: 500, message: "Server Error" });
    }
  },

  updateEligibility: async (req, res) => {
    try {
      let { user, property } = req;
      const { name } = req.params;
      property = property.find(propertyObj => propertyObj.name === name);
      if (!property) {
        throw new Error("property does not exists");
      }

      if (property.eligible === "Eligible") {
        throw new Error("repeated updation of eligible property is prohibited");
      }

      property.eligible = "Eligible";
      property = await property.save();
      res.status(401).json({ statusCode: 401, property, user });
    } catch (err) {
      console.log(err.message);
      if (
        err.message === "property does not exists" ||
        err.message === "repeated updation of eligible property is prohibited"
      ) {
        return res.status(400).json({ statusCode: 400, message: err.message });
      }
      res.status(500).json({ statusCode: 500, message: "Server Error" });
    }
  }
};
