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


  afterAll(async () => {
    await mongoose.disconnect();
    app.close();
  });
  

  describe("POST /auth/login", () => {

  
    // test case 1- successful login when all correct
    test("should login successfully", async () => {
      const User = {
        email: "john@xyz.com",
        password: "password123",
      };
      const response = await request(app)
        .post("/auth/login")
        .send(User);
  
      expect(response.status).toBe(200);
  
      const user = await userModel.findOne({ email: User.email });
      expect(user).toBeTruthy();
    });

    //est case 2- checking valid email format
    test('should return error for invalid email format', async () => {
      const invalidEmail = {
          email: 'invalid-email',
          password: 'password123',
      };
      const response = await request(app)
          .post('/auth/login')
          .send(invalidEmail);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
          message: "Invalid email format",
          error: true,
      });
  });
  
    // test case 3- required fields are missing
    test("should return 400 if required fields are missing", async () => {
      const response = await request(app).post("/auth/login").send({email: "john@xyz.com"}); 
  
      expect(response.status).toBe(400);
    });
  
  });