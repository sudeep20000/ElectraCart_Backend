const { UnauthenticatedError } = require("../errors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log(authHeader);
    throw new UnauthenticatedError("No token provided");
  }

  const token = authHeader.split(" ")[1];

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId };
    next();
  } catch (err) {
    throw new UnauthenticatedError("Not authorized to access this route");
  }
};

module.exports = authMiddleware;
