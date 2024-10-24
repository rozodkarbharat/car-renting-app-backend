const express = require("express");
const { handleGetMyCars, handleDeleteCar, handleUpdateCar, handleAddCar } = require("../Controllers/admin.controller");
const authorization = require("../middleware/authorization");
const { upload } = require("../utils/fileUpload.util");

const adminRouter = express.Router();


adminRouter.get("/my-cars", authorization(['admin']), handleGetMyCars)

adminRouter.post('/delete-car', authorization(['admin']), handleDeleteCar)

adminRouter.post('/update-car', authorization(['admin']), handleUpdateCar)

adminRouter.post("/add-car",authorization(['admin']), upload.single("image"),handleAddCar)


module.exports = adminRouter;
