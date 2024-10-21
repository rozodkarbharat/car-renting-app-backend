
const express = require("express");
const carDetailModel = require("../model/car_detail.model");
const carBookingModel = require("../model/carbooking.model");
const CarModel = require("../model/cars_model.model");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const Multer = require("multer");
const { handleAddCar, handleGetCarsByModelId, getAllAvailableCars, handleAddCarModel, handleBookCar, handleGetFeaturedCars, handleGetCarModels } = require("../Controllers/car.controller");
const Authentication = require("../middleware/authenication");


const carRouter = express.Router()


const storage = new Multer.memoryStorage();

const upload = Multer({
    storage,
});

carRouter.post('/add-car-model', handleAddCarModel)

carRouter.post("/get-available-cars-by-modelid", handleGetCarsByModelId);

carRouter.post("/get-all-available-cars", getAllAvailableCars);

carRouter.post("/add-car",Authentication, upload.single("image"),handleAddCar)

carRouter.post("/book-car", Authentication , handleBookCar)

carRouter.get("/featured-cars",handleGetFeaturedCars)

carRouter.get("/get-models", handleGetCarModels)

module.exports = carRouter;


