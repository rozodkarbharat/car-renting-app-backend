const mongoose = require("mongoose");

const carBookingSchema = mongoose.Schema({
  carid:String,
  bookingid:String,
  starttime:Number,
  endtime:Number,
  modelid:String
});

const carBookingModel = mongoose.model("booking", carBookingSchema);

module.exports = carBookingModel;
