const carDetailModel = require("../model/car_detail.model");
const { handleUpload } = require("../utils/fileUpload.util");



async function handleGetMyCars (req, res) {
    try {
        const { userid } = req

        let data = await carDetailModel.aggregate([
            {
                $match: { userid: userid },

            },
            {
                $lookup: {
                    from: 'car_models',
                    localField: 'modelid',
                    foreignField: 'id',
                    as: 'carModels'
                }
            }
        ]);
        res.status(200).send({ data, error: false });

    }
    catch (err) {
        console.log(err, 'error message')
        res.status(404).send({ message: "Something went wrong!", error: true });
    }
}


async function handleDeleteCar(req, res) {
    try{
        let {id} = req.body;
        if (!id) {
            return res.status(400).send({ message: "Car ID is required", error: true });
        }
        let data = await carDetailModel.deleteOne({_id:id});
        if (data.deletedCount === 0) {
            return res.status(404).send({ message: "Car not found", error: true });
        }
        res.status(200).send({ message: "Car is deleted", error: false });
    }
    catch(err) {
        console.log(err, 'error message')
        res.status(404).send({ message: "Something went wrong!", error: true });
    }
}

async function handleUpdateCar(req, res) {
    try{
        let {id,charge} = req.body;

        if (!id || charge === undefined) {
            return res.status(400).send({ message: "Car ID and charge are required", error: true });
        }
        
        let data = await carDetailModel.updateOne({_id:id},{$set:{charge}});

        if (data.nModified === 0) {
            return res.status(404).send({ message: "Car not found or no update made", error: true });
        }

        res.status(200).send({ message: "Car is updated", error: false });
    }
    catch(err) {
        console.log(err, 'error message')
        res.status(404).send({ message: "Something went wrong!", error: true });
    }
}

async function handleAddCar(req, res) {
    try {
        let {
            carnumber, modelid, fueltype, charge, carid
        } = req.body
        let userid = req?.userid

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


module.exports = {handleGetMyCars, handleDeleteCar, handleUpdateCar, handleAddCar};