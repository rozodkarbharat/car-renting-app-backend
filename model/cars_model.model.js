const mongoose = require("mongoose");

const carSchema = mongoose.Schema({
  modelname: String,
  brandname: String,
  modelid: String

});

const carModel = mongoose.model("car_model", carSchema);

module.exports = carModel;
