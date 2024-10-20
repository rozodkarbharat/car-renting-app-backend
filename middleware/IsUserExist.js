const userModel = require("../model/user.model");


const IsUserExist=async(req,res,next)=>{
    const email = req.body.email;
    const logindata = await userModel.findOne({ email });

    if (logindata) {
      res.send({message:"User already exists",error:true});
    } 
    else {
      next();
    }
}
module.exports=IsUserExist