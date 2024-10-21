const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const request = require('supertest');
const userModel = require("../../model/user.model");
require("dotenv").config();
const app = require("../../index")
const mongoose = require("mongoose");


// connecting db
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL);
});

// cleaning users after test
afterEach(async () => {
  await userModel.deleteMany({});
});

// disconnecting db after all test cases
afterAll(async () => {
  await mongoose.disconnect();
});


describe("POST /auth/signup", () => {
  // test case 1- successful registration when all correct
  test("should register a new user successfully", async () => {
    const newUser = {
      name: "John Doe",
      email: "john@xyz.com",
      password: "password123",
      role: "user",
    };
    const response = await request(app)
      .post("/auth/signup")
      .send(newUser);

    expect(response.status).toBe(200);

    const user = await userModel.findOne({ email: newUser.email });
    expect(user).toBeTruthy();
  });
    // test case 3- failed registration when email already exists
    test('should return 400 if user already exists', async () => {
      await request(app)
        .post("/auth/signup")
        .send({
          name: 'Jane Doe',
          email: 'jane@xyz.com',
          phone: '0987654321',
          password: 'password123',
          role: 'user',
        });

      const response = await request(app)
        .post('/auth/signup')
        .send({
          name: 'Jao Doe',
          email: 'jane@xyz.com',
          password: 'password123',
          role: 'user',
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({'message':'User already exists',error:true});
    });
});


describe("POST auth/login", () => {

})


