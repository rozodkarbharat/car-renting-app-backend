const mongoose = require("mongoose");

const cardetailSchema = mongoose.Schema({
  id: String,
  carnumber: String,
  modelid: String,
  fueltype: String,
  charge:Number,
  image:String,
  carid:String,
  userid:String,
});

const carDetailModel = mongoose.model("cardetail", cardetailSchema);

module.exports = carDetailModel;
