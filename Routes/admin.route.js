const express = require("express");
var jwt = require("jsonwebtoken");
const carDetailModel = require("../model/car_detail.model");
const { handleGetMyCars, handleDeleteCar, handleUpdateCar } = require("../Controllers/admin.controller");


const adminRouter = express.Router();

adminRouter.get("/my-cars", handleGetMyCars)

adminRouter.post('/delete-car', handleDeleteCar)


adminRouter.post('/update-car', handleUpdateCar)

module.exports = adminRouter;
