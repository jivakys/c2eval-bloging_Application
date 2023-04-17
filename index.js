const express = require("express");
var cookieParser = require("cookie-parser");
const { connection } = require("./config/db");
const { userRoter } = require("./routes/user.route");
const { blogRouter } = require("./routes/blog.route");

const app = express();
require("dotenv").config();
app.use(express.json());
app.use(cookieParser());
app.use("/user", userRoter);
app.use("/blog", blogRouter);
app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (err) {
    console.log({ msg: err.message });
  }
  console.log(`Server Running on port ${process.env.port}`);
});
