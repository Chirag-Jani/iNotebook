const jwt = require("jsonwebtoken");
const JWT_SECRET = "chiragJaniSecret01";

const getUser = async (req, res, next) => {
  // * get user from jwt and add id to req object
  const token = req.header("auth-token");

  if (!token) {
    req.status(401).json({ error: "Access Denied" });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    req.status(401).json({ error: "Access Denied" });
  }
};

module.exports = getUser;
