const express = require("express");
const Authentication = require("../middleware/authenication");
const { handleGetMyCars, handleDeleteCar, handleUpdateCar } = require("../Controllers/admin.controller");
const authorization = require("../middleware/authorization");


const adminRouter = express.Router();


adminRouter.get("/my-cars", authorization(['admin']), handleGetMyCars)

adminRouter.post('/delete-car', authorization(['admin']), handleDeleteCar)

adminRouter.post('/update-car', authorization(['admin']), handleUpdateCar)

module.exports = adminRouter;
