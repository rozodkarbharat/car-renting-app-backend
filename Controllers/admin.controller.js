var jwt = require("jsonwebtoken");
const carDetailModel = require("../model/car_detail.model");



async function handleGetMyCars (req, res) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const { userid } = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

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


module.exports = {handleGetMyCars, handleDeleteCar, handleUpdateCar};