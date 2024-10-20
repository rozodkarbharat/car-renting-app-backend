const express = require("express");
const carBookingModel = require("../model/carbooking.model");
const Authentication = require("../middleware/authenication");


const userRouter = express.Router()

userRouter.get('/', Authentication , async function (req, res) {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const { userid } = jwt.verify(
            token,
            "secret"
        );
        let data = await carBookingModel.find({userid: userid})
        console.log(data,'data')
        response.status(200).send({data,error:false});
    }
    catch (err) {
        res.status(404).send({ message: "Something went wrong!", error: true });
    }
})


module.exports = userRouter