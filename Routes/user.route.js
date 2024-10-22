const express = require("express");
const carBookingModel = require("../model/carbooking.model");
const Authentication = require("../middleware/authenication");
const { getAllBookedCars, cancelBooking } = require("../Controllers/user.controller");

const userRouter = express.Router()

userRouter.get('/booked-cars', Authentication , getAllBookedCars)

userRouter.post('/cancel-booking',Authentication, cancelBooking)

module.exports = userRouter