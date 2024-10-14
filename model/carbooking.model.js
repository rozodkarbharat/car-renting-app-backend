const mongoose = require("mongoose");

const carBookingSchema = mongoose.Schema({
  carid:String,
  bookingid:String,
  starttime:String,
  endtime:String,
});

const carBookingModel = mongoose.model("booking", carBookingSchema);

module.exports = carBookingModel;
