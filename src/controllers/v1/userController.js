const asyncHandler = require("express-async-handler");
const httpStatus = require("http-status");
const { sendSuccessResponse } = require("../../utils/success");
const { sendErrorResponse } = require("../../utils/failure");
const User = require("../../models/UserModel");
const { checkPermission } = require("../../utils/helperFuntions");

const createUser = asyncHandler(async (req, res) => {

  const { name, email, password, account_type, } = req.body;


  let userExists = await User.findOne({ email });
  if (userExists) { return sendErrorResponse(httpStatus.NOT_FOUND, res, "User already exists with this mail") }

  const userData = {
    name,
    email,
    password,
    account_type,
    status: "active",
  };
  let user = await User.create(userData);
  sendSuccessResponse(
    httpStatus.CREATED,
    res,
    "User registered successfully!",
    user
  );
});
const updateUser = asyncHandler(async (req, res) => {

  const { userId } = req.params;
  const { name, email, password, account_type, status,
  } = req.body;

  //check if user exists
  let user = await User.findById(userId);
  if (!user) { return sendErrorResponse(httpStatus.NOT_FOUND, res, "User not found") }


  let userExists = await User.findOne({ email, _id: { $ne: user._id } });
  if (userExists) { return sendErrorResponse(httpStatus.NOT_FOUND, res, "Email already in use") }


  const userData = {
    name,
    email,
    password,
    account_type,
    status,
  };

  Object.assign(user, userData)

  await user.save()

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "User updated successfully!",
    user
  );
});
const changeStatus = asyncHandler(async (req, res) => {
  //check permissions
  if (!await checkPermission('changeStatus', req.user)) return sendErrorResponse(httpStatus.NOT_FOUND, res, "Permission denied!")

  const { userId } = req.params;
  const { status } = req.body;

  //check if user exists
  let user = await User.findById(userId);
  if (!user) { return sendErrorResponse(httpStatus.NOT_FOUND, res, "User not found") }


  const userData = {
    status,
  };

  Object.assign(user, userData)

  await user.save()
  // let user = await User.create(userData);
  // user = JSON.parse(JSON.stringify(user));
  // const response = {
  //   ...user,
  //   token: generateToken(user._id),
  // };
  sendSuccessResponse(
    httpStatus.OK,
    res,
    "User updated successfully!",
    user
  );
});
const getUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  let user = await User.findById(userId);
  if (!user) { return sendErrorResponse(httpStatus.NOT_FOUND, res, "User not found") }

  sendSuccessResponse(
    httpStatus.CREATED,
    res,
    "User fetched successfully!",
    user
  );
});
const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  let user = await User.findById(userId);
  if (!user) { return sendErrorResponse(httpStatus.NOT_FOUND, res, "User not found") }


  await User.findByIdAndDelete(userId)

  sendSuccessResponse(
    httpStatus.OK,
    res,
    "User deleted successfully!",
    user
  );
});

const fetchAllUsers = asyncHandler(async (req, res) => {
  const keywordFilter = req.query.search
    ? {
      $or: [
        { name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ],
    }
    : {};

  const users = await User.find(keywordFilter).find();

  sendSuccessResponse(httpStatus.OK, res, "Users fetched successfully", users);
});

module.exports = {
  createUser,
  updateUser,
  changeStatus,
  getUser,
  deleteUser,
  fetchAllUsers,
};
