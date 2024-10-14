
const express = require("express");
const carModel = require("../model/cars_model.model");
const carDetailModel = require("../model/car_detail.model");
const carBookingModel = require("../model/carbooking.model");



const carRouter = express.Router()



carRouter.post('/add-car-model', async function (req, res) {
    try {
        let { modelname, brandname, modelid } = req.body
        console.log(modelname, id, 'addmodel')
        const data = new carModel({ modelname: modelname, brandname: brandname, modelid });
        await data.save()
        res.status(200).send({ message: "Car model is added to database", error: false })
    }
    catch (err) {
        res.status(500).send({ message: "something went wrong", error: true })
    }
})


carRouter.post("/get-available-cars", async (req, res) => {
    try {
        // Get starttime, endtime, and modelid from the request body
        let { starttime, endtime, modelid } = req.body;

        if (!starttime || !endtime || !modelid) {
            return res.status(400).json({ error: "Please provide starttime, endtime, and modelid" });
        }

        
        
        res.status(200).json({ availableCars });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while retrieving available cars" });
    }
});



carRouter.post("/add-car", async (req, res) => {
    try {
        let { id,
            carnumber,
            modelid,
            fueltype,
            charge } = req.body
        console.log(id,
            carnumber,
            modelid,
            fueltype,
            charge, 'add car')
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
            bookingid,
            starttime,
            endtime } = req.body

        const data = new carBookingModel({
            carid,
            bookingid,
            starttime,
            endtime
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
                from: 'car_models',            // The collection to join with (use the actual collection name in the database)
                localField: 'modelid',        // The field in carDetailModel that contains the model ID
                foreignField: 'id',          // The field in car_model collection that matches the localField
                as: 'carModels'               // The name of the field in which to store the joined data
              }
            }
          ]);
        res.status(200).send({ message: "",data, error:false }) 
    }
    catch (err) {
        console.log(err,'error')
        res.status(500).send({message:"Something went wrong",error:true})
    }
})

module.exports = carRouter;


