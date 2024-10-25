const express = require("express");
var cors = require("cors");
const carRouter = require("./Routes/car.route");
const adminRouter = require("./Routes/admin.route");
const authRoute = require("./Routes/auth.route");
const userRouter = require("./Routes/user.route");
const connection = require("./db");
let cookieParser = require('cookie-parser'); 

const app = express();


app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser()); 

app.use("/auth", authRoute);
app.use("/car", carRouter);
app.use("/admin", adminRouter);
app.use("/user", userRouter);

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


module.exports = app;