const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");
const jwtMiddleware = require("../middlewares/jwtMiddleware");
const { withMessage, sendResponse } = require("../middlewares/response");


// GET /users/overview
router.get(
  "/overview",
  controller.readOverview,
  withMessage("Users overview:", 200),
  sendResponse,
);


// GET /users/me
router.get(
  "/me",
  jwtMiddleware.verifyToken,
  controller.readSelf,
  withMessage("User details:", 200),
  sendResponse,
);


// GET /users/profile
router.get(
  "/profile",
  jwtMiddleware.verifyToken,
  controller.readProfile,
  withMessage("User profile data:", 200),
  sendResponse,
);


// PUT /users
router.put(
  "/",
  jwtMiddleware.verifyToken,
  controller.checkUsernameUnique,
  controller.updateUser,
  controller.readUserById,
  withMessage("User updated successfully", 200),
  sendResponse,
);

module.exports = router;
