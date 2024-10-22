const carDetailModel = require("../model/car_detail.model");
const carBookingModel = require("../model/carbooking.model");
const CarModel = require("../model/cars_model.model");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const Multer = require("multer");


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function handleUpload(file) {
    const res = await cloudinary.uploader.upload(file, {
        resource_type: "auto",
    });
    return res;
}


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


async function getAllAvailableCars(req, res) {
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
                localField: "carid",
                foreignField: "carid",
                as: "carDetail"
            }
        }])

        res.status(200).json({ data: availableCars, error: false });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while retrieving available cars", error: true });
    }
}

async function handleAddCar(req, res) {
    try {
        let {
            carnumber, modelid, fueltype, charge, carid, userid
        } = req.body
        if (!req.file) {
            return res.status(400).send({ message: "No file uploaded", error: true });
        }

        if (!carnumber || !modelid || !fueltype || !charge || !carid || !userid) {
            return res.status(400).send({ message: "All fields (carnumber, modelid, fueltype, charge, carid, userid) are required", error: true });
        }

        if (isNaN(charge)) {
            return res.status(400).send({ message: "Charge must be numeric value", error: true });
        }

        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const cldRes = await handleUpload(dataURI);



        let id = Date.now()

        const data = new carDetailModel({
            id,
            carnumber,
            modelid,
            fueltype,
            charge,
            carid,
            userid,
            image: cldRes.secure_url
        });

        await data.save()
        res.status(200).send({ message: "Car is added to database", error: false })

    }
    catch (err) {
        console.log(err, "eror")
        res.status(500).send({ message: "something went wrong", error: true })
    }
}

async function handleBookCar(req, res) {
    try {
        const { carid,
            modelid,
            starttime,
            endtime, userid } = req.body

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

module.exports = { handleAddCar, handleGetCarsByModelId, getAllAvailableCars, handleAddCarModel, handleBookCar, handleGetFeaturedCars, handleGetCarModels }