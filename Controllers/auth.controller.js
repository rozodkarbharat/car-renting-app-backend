const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const userModel = require("../model/user.model");
require('dotenv').config()


function signupHandler(req, res) {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).send({ message: "All fields are required", error: true });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).send({ message: "Invalid email format", error: true });
        }

        if (password.length < 6) {
            return res.status(400).send({ message: "Password must be at least 6 characters long", error: true });
        }


        bcrypt.hash(password, 3, async function (err, hash) {
            if (err) {
                res.status(500).send({ message: "Please try again later", error: true });
            }
            const data = new userModel({ email, password: hash, name, role: "user" });
            await data.save();
            res.status(200).send({ message: "User Registered Successsfully", error: false });
        });
    } catch (err) {
        res.status(500).send({ message: "Something went wrong", error: true });
    }
}

async function loginHandler(req, res) {
    try {
        var { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ message: "Email and password are required", error: true });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).send({ message: "Invalid email format", error: true });
        }

        const Data = await userModel.findOne({ email });
        if (!Data) {
            res.status(200).send({ message: "Invalid credentials", error: true })
        }
        else {
            bcrypt.compare(password, Data.password, function (err, result) {
                if (result) {
                    var token = jwt.sign({ email, role: Data.role, userid: Data._id.toString() }, process.env.JWT_SECRET);
                    res.status(200).send({
                        message: "login successful",
                        token,
                        name: Data.name,
                        email,
                        id: Data._id.toString(),
                        role: Data.role,
                        error: false
                    });
                } else {
                    res.status(200).send({ message: "Invalid credentials", error: true });
                }
            });
        }
    } catch (err) {
        res.status(500).send({ message: "server Error", error: true });
    }
}


module.exports = { signupHandler, loginHandler }