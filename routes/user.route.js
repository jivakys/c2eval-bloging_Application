const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/user.model");
const { Blacklist } = require("../model/blacklist");
const userRoter = express.Router();

userRoter.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const userPresent = await UserModel.findOne({ email });
    if (userPresent) {
      return res.status(400).send("User already present, please login");
    }
    const hash = bcrypt.hashSync(password, 8);
    const newUser = new UserModel({
      name,
      email,
      password: hash,
      role,
    });
    await newUser.save();
    res.status(200).send({ msg: "user Registered", user: newUser });
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

// login
userRoter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid email or password");
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send("Invalid email or password");
    }
    const accesstoken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1m",
    });
    const refreshtoken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN,
      { expiresIn: "3m" }
    );
    res.cookie("accesstoken", accesstoken, { maxAge: 60 * 1000 });
    res.cookie("refreshtoken", refreshtoken, { maxAge: 3 * 60 * 1000 });
    res
      .status(200)
      .send({ msg: "login successful", accesstoken, refreshtoken });
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

// logout
userRoter.get("/logout", async (req, res) => {
  try {
    const { accesstoken, refreshtoken } = req.cookies;
    const blacklistToken = new Blacklist({
      accesstoken: accesstoken,
      refreshtoken: refreshtoken,
    });
    await blacklistToken.save();
    res.status(200).send({ msg: "Logout Successful" });
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

// refresh-token
userRoter.get("/refresh-token", async (req, res) => {
  const refreshToken = req.cookies.refreshtoken || req.headers?.authorization;
  const isBlacklisted = await Blacklist.findOne({
    refreshToken: refreshToken,
  });
  if (isBlacklisted) {
    return res.send({ msg: "Please Login" });
  }
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
  if (decoded) {
    const newToken = jwt.sign({ userId: decoded._id }, process.env.JWT_SECRET, {
      expiresIn: "1m",
    });
    res.cookie("accesstoken", newToken, { maxAge: 60 * 1000 });
    return res.send({ msg: "New accesstoken generated", newtoken: newToken });
  } else {
    res.send("Invalid refresh token, please login again");
  }
});

module.exports = { userRoter };
