
const express = require("express");
const { handleGetCarsByModelId, handleAddCarModel, handleBookCar, handleGetFeaturedCars, handleGetCarModels } = require("../Controllers/car.controller");
const Authentication = require("../middleware/authenication");
require("dotenv").config();


const carRouter = express.Router()




carRouter.post('/add-car-model', handleAddCarModel)

carRouter.post("/get-available-cars-by-modelid", handleGetCarsByModelId);

carRouter.post("/book-car", Authentication , handleBookCar)

carRouter.get("/featured-cars",handleGetFeaturedCars)

carRouter.get("/get-models", handleGetCarModels)

module.exports = carRouter;


