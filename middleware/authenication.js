var jwt = require("jsonwebtoken");
const userModel = require("../model/user.model");
require('dotenv').config()

const Authentication = (req, res, next) => {
  try {
    const token = req.cookies.token

    jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
      if (err) {
        res.status(401).send({message:"Please login",error:true});
      } else {
        const logindata = await userModel.findOne({
          email: decoded.email,role: decoded.role
        });

        if (logindata) {
          req.userid = decoded.userid
          next();
        } 
        else {
          res.status(401).send({message:"Please login",error:true});
        }
      }
    });
  } catch (err) {
    console.log(err,'error')
    res.status(500).send({message:"server error", error:true});
  }
};
module.exports = Authentication;
