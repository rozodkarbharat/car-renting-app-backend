const express = require("express");
const Authentication = require("../middleware/authenication");
const { handleGetMyCars, handleDeleteCar, handleUpdateCar } = require("../Controllers/admin.controller");


const adminRouter = express.Router();


adminRouter.get("/my-cars", Authentication, handleGetMyCars)

adminRouter.post('/delete-car', Authentication, handleDeleteCar)

adminRouter.post('/update-car', handleUpdateCar)

module.exports = adminRouter;
