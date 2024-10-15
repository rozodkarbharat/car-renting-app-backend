
const express = require("express");
const carDetailModel = require("../model/car_detail.model");
const carBookingModel = require("../model/carbooking.model");
const CarModel = require("../model/cars_model.model");


const carRouter = express.Router()



carRouter.post('/add-car-model', async function (req, res) {
    try {
        let { modelname, brandname, modelid } = req.body
        console.log(modelname, modelid, 'addmodel')
        const data = new CarModel({ modelname: modelname, brandname: brandname, id: modelid });
        await data.save()
        res.status(200).send({ message: "Car model is added to database", error: false })
    }
    catch (err) {
        console.log(err, 'error')
        res.status(500).send({ message: "something went wrong", error: true })
    }
})


carRouter.post("/get-available-cars-by-modelid", async (req, res) => {
    try {
        // Get starttime, endtime, and modelid from the request body
        let { starttime, endtime, modelid } = req.body;

        if (!starttime || !endtime || !modelid) {
            return res.status(400).json({ message: "Please provide starttime, endtime, and modelid", error: true });
        }

        let bookedCars = await carBookingModel.find({ $or: [{ starttime: { $gte: starttime, $lt: endtime } }, { endtime: { $lte: endtime, $gte: starttime } }, { $and:[ { starttime:{$gte:starttime} },{endtime:{$lte:endtime}} ]}], modelid: modelid })

        let carIds = bookedCars.map((elem) => {
            return elem.carid
        })


        let availableCars = await carDetailModel.aggregate([{ $match: { $and:[{carid: { $nin: carIds }},{modelid: modelid}]} }, {
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
});


carRouter.post("/get-all-available-cars", async (req, res) => {
    try {
        // Get starttime, endtime, and modelid from the request body
        let { starttime, endtime, modelid } = req.body;

        if (!starttime || !endtime || !modelid) {
            return res.status(400).json({ message: "Please provide starttime, endtime, and modelid", error: true });
        }
        
        let bookedCars = await carBookingModel.find({ $or: [{ starttime: { $gte: starttime, $lt: endtime } }, { endtime: { $lte: endtime, $gte: starttime } }, { $and:[ { starttime:{$gte:starttime} },{endtime:{$lte:endtime}} ]}], modelid: modelid })

        let carIds = bookedCars.map((elem) => {
            return elem.carid
        })


        let availableCars = await carDetailModel.aggregate([{ $match: { $and:[{carid: { $nin: carIds }},{modelid: modelid}]} }, {
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
});



carRouter.post("/add-car", async (req, res) => {
    try {
        let { id,
            carnumber,
            modelid,
            fueltype,
            charge } = req.body
  
        const data = new carDetailModel({
            id,
            carnumber,
            modelid,
            fueltype,
            charge
        });
        await data.save()
        res.status(200).send({ message: "Car is added to database", error: false })
    }
    catch (err) {
        res.status(500).send({ message: "something went wrong", error: true })
    }
})


carRouter.post("/book-car", async function (req, res) {
    try {
        const { carid,
            modelid,
            starttime,
            endtime } = req.body
            let bookingid = Date.now()
        
        const data = new carBookingModel({
            carid,
            bookingid,
            starttime,
            endtime,
            modelid
        });
        await data.save()
        res.status(200).send({ message: "Car is added to database", error: false })


    }
    catch (err) {
        res.status(500).send({ message: "Something went wrong", error: true })
    }
})

carRouter.get("/featured-cars", async function (req, res) {
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
})

carRouter.get("/get-models", async function (req, res) {
    try {
        let data = await CarModel.find({})
        res.status(200).send({ message: "All cars models", data, error: false })
    }
    catch (err) {
        console.log(err, 'error')
        res.status(500).send({ message: "Something went wrong", error: true })
    }
})

module.exports = carRouter;


