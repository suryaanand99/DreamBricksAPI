const User = require("../models/User");
const Property = require("../models/property");
const bcryptjs = require("bcryptjs");

module.exports = {
  registerUser: async (req, res) => {
    const { email, password, gender, name, dob, address } = req.body;
    try {
      //checking for existing user
      let user = await User.findOne({ email });
      if (user) {
        throw new Error("user already exists");
      }

      //creating the new user
      user = await User.create({
        email,
        password,
        gender,
        name,
        dob,
        address
      });

      //creating access token
      const accessToken = await user.generateToken();

      res.status(201).json({ statusCode: 201, accessToken, user });
    } catch (err) {
      console.log(err.message);
      if (err.message === "user already exists") {
        return res.status(400).json({ statusCode: 400, message: err.message });
      }
      res.status(500).json({ statusCode: 500, message: "Server Error" });
    }
  },

  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      //not existing user
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("UnAuthorized access");
      }

      //compare the passwords
      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) {
        throw new Error("UnAuthorized access");
      }

      //generate Token
      const accessToken = await user.generateToken();

      res.status(200).json({ statusCode: 200, user, accessToken });
    } catch (err) {
      if (err.message === "UnAuthorized access") {
        return res.status(400).json({ statusCode: 400, message: err.message });
      }
      res.status(500).json({ statusCode: 500, message: "Server Error" });
    }
  },

  logout: async (req, res) => {
    try {
      const user = req.user;
      user.accessToken = null;
      await user.save();
      res
        .status(202)
        .json({ statusCode: 202, message: "successfully logged out" });
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ statusCode: 500, message: "Server Error" });
    }
  },

  addReview: async (req, res) => {
    let { user, property } = req;
    const propertyName = req.params.propertyName;
    const { desc } = req.body;
    try {
      property = property.find(el => el.name === propertyName);
      if(!property){
        throw new Error("property does not exists")
      }

      const propertyObj = {
        personId: user._id,
        desc
      };

      property.reviews.push(propertyObj);
      property = await property.save();

      res.status(201).json({ statusCode: 201, property, user });
    } catch (err) {
      console.log(err.message);
      if (err.message === "property does not exists") {
        return res.status(400).json({ statusCode: 400, message: err.message });
      }
      res.status(500).json({ statusCode: 500, message: "Server Error" });
    }
  },

  postedProperty: async (req, res) => {
    try {
      let { user } = req;
      let property = await Property.find();
      const { posted } = user;

      let postedProperty = [];
      posted.forEach(postedObj => {
        property.forEach(propertyObj => {
          if (postedObj.equals(propertyObj._id)) {
            postedProperty.push(propertyObj);
          }
        });
      });

      if (!postedProperty) {
        throw new Error("no sold properties");
      }

      res.status(400).json({ statusCode: 400, property: postedProperty, user });
    } catch (err) {
      console.log(err.message);
      if (err.message === "no sold properties") {
        return res.status(400).json({ statusCode: 400, message: err.message });
      }
      res.status(500).json({ statusCode: 500, message: "Server Error" });
    }
  },

  addFavorites: async (req, res) => {
    try {
      let { user, property } = req;
      const { name } = req.params;

      property = property.find(el => el.name === name);
      if (!property) {
        throw new Error("property does not exist");
      }
      if (user.favorites.find(el => el.equals(property.id))) {
        throw new Error(
          "repeated updation for favorite property is prohibited"
        );
      }
      user.favorites.push(property._id);
      user = await user.save();

      res.status(401).json({ statusCode: 401, property, user });
    } catch (err) {
      console.log(err.message);
      if (
        err.message === "property does not exist" ||
        err.message === "repeated updation for favorite property is prohibited"
      ) {
        return res.status(400).json({ statusCode: 400, message: err.message });
      }
      res.status(500).json({ statusCode: 500, message: "Server Error" });
    }
  },

  viewFavorites: (req, res) => {
    try {
      let { user, property } = req;
      const { favorites } = user;

      let favoriteProperty = [];
      favorites.forEach(favoriteObj => {
        property.forEach(propertyObj => {
          if (favoriteObj.equals(propertyObj._id)) {
            favoriteProperty.push(propertyObj);
          }
        });
      });

      if (!favoriteProperty) {
        throw new Error("property does not exist");
      }

      res
        .status(200)
        .json({ statusCode: 200, property: favoriteProperty, user });
    } catch (err) {
      console.log(err.message);
      if (err.message === "Property does not exists") {
        return res.status(400).json({ statusCode: 400, message: err.message });
      }
      res.status(500).json({ statusCode: 500, message: "Server Error" });
    }
  },

  searchUser: async (req, res) => {
    try {
      const { user } = req;
      const { id } = req.params;
      let users = await User.find({ _id: id });
      if (!users) {
        throw new Error("user does not exists");
      }

      res.status(200).json({ statusCode: 200, users, user });
    } catch (err) {
      console.log(err.message);
      if (err.message === "user does not exists") {
        return res.status(400).json({ statusCode: 400, message: err.message });
      }
      res.status(500).json({ statusCode: 500, message: "Server Error" });
    }
  }
};
