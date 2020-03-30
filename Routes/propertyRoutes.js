const express = require("express");
const authenticate = require("../middlewares/authenticate");
const userCheck = require("../middlewares/userCheck");
const viewProperty = require("../middlewares/viewProperty");
const {
  addProperty,
  home,
  searchByName,
  deleteProperty,
  updateEligibility
} = require("../controllers/propertyController");

const Router = express.Router();

//Route - POST /add property
//desc - add a property
//Auth - private
Router.post("/add", authenticate, addProperty);

//Route - GET /home
//desc - view all properties
//Auth - private
Router.get("/home", authenticate, viewProperty, home);

//Route - GET /search
//desc - search through all properties
//Auth - private
Router.get("/:name", authenticate, viewProperty, searchByName);

//Route - DELETE /delete
//desc - delete a property
//Auth - private
Router.delete("/delete/:name", authenticate, userCheck,deleteProperty);

//Route - ELIGIBILITY /patch
//desc - update the eligibility of the property
//Auth - private
Router.patch("/eligibility/:name", authenticate, userCheck, viewProperty,updateEligibility);

module.exports = Router;
