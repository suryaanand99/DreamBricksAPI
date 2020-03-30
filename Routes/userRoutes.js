const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  addReview,
  postedProperty,
  addFavorites,
  viewFavorites,
  searchUser
} = require("../controllers/userControllers");
const authenticate = require("../middlewares/authenticate");
const viewProperty = require("../middlewares/viewProperty")

const Router = express.Router();

//Route - GET /user
//desc - view user
// Auth - private
Router.get("/user/:id", authenticate, searchUser);

//Route - POST /register
//desc - register a user
// Auth - public
Router.post("/register", registerUser);

//Route - POST /login
//desc - login a user
// Auth - public
Router.post("/login", loginUser);

//Route - DELETE /logout
//desc - logout a user
// Auth - private
Router.delete("/logout", authenticate, logout);

//Route - POST /review
//desc - add a review by user
// Auth - private
Router.post("/property/addreview/:propertyName", authenticate, viewProperty,addReview);

//Route - GET /posted
//desc - view posted properties
// Auth - private
Router.get("/property/posted", authenticate,postedProperty);

//Route - PATCH /addfavorites
//desc - update favorite properties
// Auth - private
Router.patch("/property/favorites/:name", authenticate, viewProperty,addFavorites);

//Route - GET /addfavorites
//desc - view favorite properties
// Auth - private
Router.get("/property/favorites", authenticate, viewProperty, viewFavorites);

module.exports = Router;
