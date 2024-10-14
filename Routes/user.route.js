const express = require("express");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const IsUserExist = require("../middleware/IsUserExist");
const userModel = require("../model/user.model");

const userRouter = express.Router();

userRouter.post("/signup", IsUserExist, (req, res) => {
    const { email, password, name } = req.body;
    try {
        bcrypt.hash(password, 3, async function (err, hash) {
            if (err) {
                res.status(500).send({ message: "Please try again later" });
            }
            const data = new userModel({ email, password: hash, name });
            await data.save();
            res.status(200).send({ message: "User Registered Successsfully" });
        });
    } catch (err) {
        res.status(500).send({ error: "Something went wrong", err });
    }
});

userRouter.post("/login", async (req, res) => {
    try {
        var { email, password } = req.body;
        const Data = await userModel.findOne({ email });
        if (!Data) {
            res.status(200).send({ message: "Invalid credentials", type: "wraning" })
        }
        else {
            bcrypt.compare(password, Data.password, function (err, result) {
                if (result) {
                    var token = jwt.sign({ email }, "secret");
                    res.send({
                        message: "login successful",
                        token,
                        name: Data.name,
                        email,
                    });
                } else {
                    res.status(200).send({ message: "Invalid credentials", type: "wraning" });
                }
            });
        }
    } catch (err) {
        res.status(500).send({ error: "server Error" });
    }
});




module.exports = userRouter;
