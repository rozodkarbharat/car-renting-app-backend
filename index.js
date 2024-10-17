const express = require("express");
const app = express();
var cors = require("cors");
const userRouter = require("./Routes/user.route");
const carRouter = require("./Routes/car.route");
const adminRouter = require("./Routes/admin.route");


const connection = require("./db");


app.use(express.json());
app.use(cors());

app.use("/user", userRouter);
app.use("/car", carRouter);
app.use("/admin", adminRouter);

app.get("/", (req, res) => {
  res.send("Welcome to homepage");
});


app.listen(8000, async () => {
  await connection
  try{
 console.log("server running 8000");
  }
  catch(err){
  console.log(err)
  }
});
