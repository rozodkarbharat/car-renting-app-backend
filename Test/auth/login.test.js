const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const request = require('supertest');
const userModel = require("../../model/user.model");
require("dotenv").config();
const app = require("../../index")
const mongoose = require("mongoose");



beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL);
  });