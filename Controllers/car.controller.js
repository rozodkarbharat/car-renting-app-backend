const carDetailModel = require("../model/car_detail.model");
const carBookingModel = require("../model/carbooking.model");
const CarModel = require("../model/cars_model.model");
require("dotenv").config();



async function handleAddCarModel(req, res) {
    try {
        let { modelname, brandname, modelid } = req.body

        if (!modelname || !brandname || !modelid) {
            return res.status(400).send({ message: "All fields (modelname, brandname, modelid) are required", error: true });
        }

        const data = new CarModel({ modelname: modelname, brandname: brandname, id: modelid });
        await data.save()
        res.status(200).send({ message: "Car model is added to database", error: false })
    }
    catch (err) {
        console.log(err, 'error')
        res.status(500).send({ message: "something went wrong", error: true })
    }
}

async function handleGetCarsByModelId(req, res) {
    try {
        let { starttime, endtime, modelid } = req.body;

        if (!starttime || !endtime || !modelid) {
            return res.status(400).json({ message: "Please provide starttime, endtime, and modelid", error: true });
        }

        let bookedCars = await carBookingModel.find({ $or: [{ starttime: { $gte: starttime, $lt: endtime } }, { endtime: { $lte: endtime, $gte: starttime } }, { $and: [{ starttime: { $gte: starttime } }, { endtime: { $lte: endtime } }] }], modelid: modelid })

        let carIds = bookedCars.map((elem) => {
            return elem.carid
        })


        let availableCars = await carDetailModel.aggregate([{ $match: { $and: [{ carid: { $nin: carIds } }, { modelid: modelid }] } }, {
            $lookup: {
                from: "car_models",
                localField: "modelid",
                foreignField: "id",
                as: "carModels"
            }
        }])

        res.status(200).json({ data: availableCars, error: false });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while retrieving available cars", error: true });
    }
}

async function handleBookCar(req, res) {
    try {
        const { carid,
            modelid,
            starttime,
            endtime } = req.body
            let userid = req.userid

        if (!carid || !modelid || !starttime || !endtime || !userid) {
            return res.status(400).send({ message: "All fields (carid, modelid, starttime, endtime, userId) are required", error: true });
        }

        let bookingid = Date.now()

        const data = new carBookingModel({
            carid,
            bookingid,
            starttime,
            endtime,
            modelid,
            userid: userid
        });
        await data.save()
        res.status(200).send({ message: "Car is added to database", error: false })
    }
    catch (err) {
        res.status(500).send({ message: "Something went wrong", error: true })
    }
}

async function handleGetFeaturedCars(req, res) {
    try {
        let data = await carDetailModel.aggregate([
            {
                $lookup: {
                    from: 'car_models',
                    localField: 'modelid',
                    foreignField: 'id',
                    as: 'carModels'
                }
            }
        ]);
        res.status(200).send({ message: "", data, error: false })
    }
    catch (err) {
        console.log(err, 'error')
        res.status(500).send({ message: "Something went wrong", error: true })
    }
}

async function handleGetCarModels(req, res) {
    try {
        let data = await CarModel.find({})
        res.status(200).send({ message: "All cars models", data, error: false })
    }
    catch (err) {
        console.log(err, 'error')
        res.status(500).send({ message: "Something went wrong", error: true })
    }
}

module.exports = { handleGetCarsByModelId, handleAddCarModel, handleBookCar, handleGetFeaturedCars, handleGetCarModels }