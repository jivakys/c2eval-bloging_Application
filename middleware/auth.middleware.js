const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/user.model");

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = decodedToken;
    const user = await UserModel.findOne({ _id: userId });
    const role = user?.role;
    req.role = role;
    next();
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
};

module.exports = { auth };
