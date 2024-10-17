const mongoose = require("mongoose");

const carSchema = mongoose.Schema({
  modelname: String,
  brandname: String,
  id: String
});

const CarModel = mongoose.model("car_models", carSchema);

module.exports = CarModel;
