const express = require("express");
const userController = require("../../controllers/v1/userController");
const validateRequest = require('../../middlewares/validationMiddleware')
const userValidations = require('../../validations/userValidations')
const router = express.Router();

router
  .route("/")
  .post(
    validateRequest(userValidations.createUser),
    userController.createUser)
  .get(userController.fetchAllUsers);

router.route('/:userId')
  .get(
    validateRequest(userValidations.getUser),
    userController.getUser)
  .put(
    validateRequest(userValidations.updateUser),
    userController.updateUser)
  .delete(
    validateRequest(userValidations.deleteUser),
    userController.deleteUser)


module.exports = router;
