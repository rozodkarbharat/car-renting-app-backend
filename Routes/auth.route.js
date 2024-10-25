const express = require("express");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const IsUserExist = require("../middleware/IsUserExist");
const userModel = require("../model/user.model");
const { signupHandler, loginHandler, validateToken } = require("../Controllers/auth.controller");

const authRoute = express.Router();

authRoute.post("/signup", IsUserExist, signupHandler);

authRoute.post("/login", loginHandler);

authRoute.get("/validate-user",validateToken)


module.exports = authRoute;
