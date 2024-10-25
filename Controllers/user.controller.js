const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const userModel = require("../model/user.model");
const carBookingModel = require("../model/carbooking.model");


async function getAllBookedCars(req, res) {
    try {
        let { userid } = req;
        let bookedCars = await carBookingModel.aggregate([{ $match:  { userid: userid }} , {
            $lookup: {
                from: "car_models",
                localField: "modelid",
                foreignField: "id",
                as: "carModels"
            }
        },{
            $lookup: {
                from: "cardetails",
                localField: "carid",
                foreignField: "carid",
                as: "carDetails"
            }
        }])
         
        res.status(200).json({ data: bookedCars, error: false });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while retrieving booked cars", error: true });
    }
}


async function cancelBooking(req, res) {
    try {
        let { id } = req.body;

        let deletedCar = await carBookingModel.deleteOne({ _id: id})
        
        res.status(200).json({ data: deletedCar, error: false });
    }
    catch (err) {
        console.error(err,'error occurred while deleting booking');
        res.status(500).json({ error: "An error occurred while cancelling booked cars", error: true });
    }
}



module.exports = { getAllBookedCars, cancelBooking}