const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");
const cityController = require("../controllers/cityController");
const armyController = require("../controllers/armyController");
const cityUtil = require("../utils/cityUtil");
const armyUtil = require("../utils/armyUtil");
const { withMessage, sendResponse } = require("../middlewares/response");

// 1. POST /users
router.post(
  "/",
  controller.checkUsernameUnique,
  controller.createNewUser,
  cityUtil.getPopulation,
  cityController.createNewCity,
  armyUtil.getArmyMaxSize,
  armyUtil.getArmyPower,
  armyController.createNewArmy,
  controller.readUserById,
  withMessage("Player created successfully", 201),
  sendResponse,
);

//2. GET /users
router.get(
  "/",
  controller.readAllUser,
  withMessage("All users details:", 200),
  sendResponse,
);

//3. GET /users/{user_id}
router.get(
  "/:user_id",
  controller.readUserById,
  withMessage("User details:", 200),
  sendResponse,
);

// 4. PUT /users/{user_id}
router.put(
  "/:user_id",
  controller.checkUsernameUnique,
  controller.updateUser,
  controller.readUserById,
  withMessage("User updated successfully", 200),
  sendResponse,
);

module.exports = router;
