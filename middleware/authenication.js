var jwt = require("jsonwebtoken");

const userModel = require("../model/user.model");

const Authentication = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, "secret", async function (err, decoded) {
      if (err) {
        res.status(401).send({message:"Please login",error:true});
      } else {
        const logindata = await userModel.findOne({
          email: decoded.email,role: decoded.role
        });

        if (logindata) {
          req.body.email = logindata.email;
          req.body.userid = logindata?._id.toString();
          next();
        } else {
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
