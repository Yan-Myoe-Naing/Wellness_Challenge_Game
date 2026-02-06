const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const cityController = require("../controllers/cityController");
const armyController = require("../controllers/armyController");
const cityMiddleware = require("../middlewares/cityMiddleware");
const armyMiddleware = require("../middlewares/armyMiddleware");
const bcryptMiddleware = require("../middlewares/bcryptMiddleware")
const jwtMiddleware = require("../middlewares/jwtMiddleware")
const validation = require("../middlewares/authValidation");
const { withMessage, sendResponse } = require("../middlewares/response");

// POST /auth/register
router.post(
  "/register",
  validation.validateAuthInput,
  userController.checkUsernameUnique,
  bcryptMiddleware.hashPassword,
  userController.createNewUser,
  cityMiddleware.getPopulation,
  cityController.createNewCity,
  armyMiddleware.getArmyMaxSize,
  armyMiddleware.getArmyPower,
  armyController.createNewArmy,
  jwtMiddleware.generateToken,
  jwtMiddleware.sendToken,
  withMessage("Player created successfully", 201),
  sendResponse
);

// POST /auth/login
router.post("/login", 
    validation.validateAuthInput,
    userController.login, 
    bcryptMiddleware.comparePassword, 
    jwtMiddleware.generateToken, 
    jwtMiddleware.sendToken,
    withMessage("Logged in successfully", 201),
    sendResponse
);




module.exports = router;
