const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const userModel = require("../model/user.model");


function signupHandler(req, res) {
    const { email, password, name } = req.body;
    try {
        bcrypt.hash(password, 3, async function (err, hash) {
            if (err) {
                res.status(500).send({ message: "Please try again later", error:true });
            }
            const data = new userModel({ email, password: hash, name, role:"user" });
            await data.save();
            res.status(200).send({ message: "User Registered Successsfully", error: false });
        });
    } catch (err) {
        res.status(500).send({ message: "Something went wrong", error:true });
    }
}

async function loginHandler(req, res)  {
    try {
        var { email, password } = req.body;
        const Data = await userModel.findOne({ email });
        if (!Data) {
            res.status(200).send({ message: "Invalid credentials", error:true })
        }
        else {
            bcrypt.compare(password, Data.password, function (err, result) {
                if (result) {
                    var token = jwt.sign({ email, role:Data.role, userid:Data._id.toString()}, "secret");
                    res.status(200).send({
                        message: "login successful",
                        token,
                        name: Data.name,
                        email,
                        id:Data._id.toString(),
                        role:Data.role,
                        error:false
                    });
                } else {
                    res.status(200).send({ message: "Invalid credentials",error:true });
                }
            });
        }
    } catch (err) {
        res.status(500).send({ message: "server Error", error:true });
    }
}


module.exports = { signupHandler, loginHandler}