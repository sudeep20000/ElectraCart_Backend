const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const login = async (req, res) => {
  const { logInID, password } = req.body;

  if (!logInID || !password) {
    throw new BadRequestError("Plz provide all Credentials");
  }

  let email;
  let phone;
  let user;
  if (logInID.length === 10) {
    phone = logInID;
    user = await User.findOne({ phone });
  } else {
    email = logInID;
    let isContains = email.includes("@");
    if (isContains) user = await User.findOne({ email });
    else throw new UnauthenticatedError("Email_ID must contains @");
  }

  if (!user) {
    throw new UnauthenticatedError("user not found , plz register");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const token = user.createJWT();

  res.status(StatusCodes.OK).json({ token, userName: user.name });
};

const register = async (req, res) => {
  const { name, phone, email, password } = req.body;

  if (!name || !phone || !email || !password) {
    throw new BadRequestError("Please provide all Credentials");
  }

  const user = await User.create({ ...req.body });

  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({ token, userName: user.name });
};

module.exports = { login, register };
