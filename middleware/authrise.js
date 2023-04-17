const authorise = (permittedrole) => {
  return (req, res, next) => {
    const userRole = req.role;
    if (permittedrole.includes(userRole)) {
      next();
    } else {
      res.status(400).send({ msg: "access denied" });
    }
  };
};

module.exports = { authorise };
