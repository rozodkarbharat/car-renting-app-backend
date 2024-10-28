const express = require("express");
const carBookingModel = require("../model/carbooking.model");
const Authentication = require("../middleware/authenication");
const { getAllBookedCars, cancelBooking, handleBookCar } = require("../Controllers/user.controller");

const userRouter = express.Router()

userRouter.get('/booked-cars', Authentication , getAllBookedCars)

userRouter.post('/cancel-booking',Authentication, cancelBooking)

userRouter.post("/book-car", Authentication , handleBookCar)

module.exports = userRouter