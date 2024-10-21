// __tests__/database.test.js

require("dotenv").config();
const mongoose = require("mongoose");


describe("MongoDB Connection", () => {
  beforeAll(async () => {
    //this will ensure disconnecting the db before all test cases
    await mongoose.disconnect();
  });

  afterAll(async () => {
    //this will ensure disconnecting the db after all test cases
    await mongoose.disconnect();
  });

// test case 1 - checking mongo db conenction 
  test("connects to the local MongoDB database", async () => {
    await mongoose.connect(process.env.MONGO_URL);

    const dbState = mongoose.connection.readyState;
    expect(dbState).toBe(1);
  });


// test case 2 - connecting mongo db and defining a schema
  test("can perform database operations", async () => {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URL);
    }

    // Defining a test schema
    const TestSchema = new mongoose.Schema({
      name: String,
    });

    // Creating a model
    const TestModel = mongoose.model("Test", TestSchema);

    // Creating a document
    const testDoc = new TestModel({ name: "test" });
    await testDoc.save();

    // Retrieving the document
    const retrievedDoc = await TestModel.findOne({ name: "test" });

    expect(retrievedDoc.name).toBe("test");

    // Cleaning up the test
    await TestModel.deleteOne({ name: "test" });
  });

// test case 3- potentially define an incorrect uri and attempting connection
  test("handles connection errors", async () => {
    await expect(
      mongoose.connect("mongodb://invalid-uri:27017/test")
    ).rejects.toThrow();
  });
});