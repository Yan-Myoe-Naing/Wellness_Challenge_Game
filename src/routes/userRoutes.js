const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");
const cityController = require("../controllers/cityController");
const armyController = require("../controllers/armyController");
const cityMiddleware = require("../middlewares/cityMiddleware");
const armyMiddleware = require("../middlewares/armyMiddleware");
const bcryptMiddleware = require("../middlewares/bcryptMiddleware")
const jwtMiddleware = require("../middlewares/jwtMiddleware")
const { withMessage, sendResponse } = require("../middlewares/response");


//  POST /users
router.post(
  "/",
  controller.checkUsernameUnique,
  bcryptMiddleware.hashPassword,
  controller.createNewUser,
  cityMiddleware.getPopulation,
  cityController.createNewCity,
  armyMiddleware.getArmyMaxSize,
  armyMiddleware.getArmyPower,
  armyController.createNewArmy,
  controller.readUserById,
  withMessage("Player created successfully", 201),
  sendResponse,
);

// GET /users
router.get(
  "/",
  controller.readAllUser,
  withMessage("All users details:", 200),
  sendResponse,
);

// GET /users/user_id
router.get(
  "/:user_id",
  controller.readUserById,
  withMessage("User details:", 200),
  sendResponse,
);

//  PUT /users/{user_id}
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
