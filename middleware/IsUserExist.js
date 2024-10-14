const userModel = require("../model/user.model");


const IsUserExist=async(req,res,next)=>{
    const email = req.body.email;
    const logindata = await userModel.findOne({ email });
    console.log(logindata,'uer exist')
    if (logindata) {
      res.send("user already exists");
    } 
    else {
      next();
    }
}
module.exports=IsUserExist