const express = require("express");
const { signupHandler, loginHandler } = require("../Controllers/user.controller");
const IsUserExist = require("../middleware/IsUserExist");


const userRouter = express.Router();

userRouter.post("/signup", IsUserExist, signupHandler);

userRouter.post("/login",loginHandler);




module.exports = userRouter;
