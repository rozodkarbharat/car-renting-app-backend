var jwt = require("jsonwebtoken");
const carDetailModel = require("../model/car_detail.model");



async function handleGetMyCars (req, res) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const { userid } = jwt.verify(
            token,
            "secret"
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
        let data = await carDetailModel.deleteOne({_id:id});
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
        let data = await carDetailModel.updateOne({_id:id},{$set:{charge}});
        res.status(200).send({ message: "Car is updated", error: false });
    }
    catch(err) {
        console.log(err, 'error message')
        res.status(404).send({ message: "Something went wrong!", error: true });
    }
}


module.exports = {handleGetMyCars, handleDeleteCar, handleUpdateCar};