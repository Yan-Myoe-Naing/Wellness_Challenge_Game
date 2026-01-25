const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const cityController = require("../controllers/cityController");
const armyController = require("../controllers/armyController");
const cityMiddleware = require("../middlewares/cityMiddleware");
const armyMiddleware = require("../middlewares/armyMiddleware");
const bcryptMiddleware = require("../middlewares/bcryptMiddleware")
const jwtMiddleware = require("../middlewares/jwtMiddleware")
const { withMessage, sendResponse } = require("../middlewares/response");

router.post(
  "/register",
  userController.checkUsernameUnique,   // ensure username not taken
  bcryptMiddleware.hashPassword,        // hash password before saving
  userController.createNewUser,         // insert user into DB
  cityMiddleware.getPopulation,               // generate random population
  cityController.createNewCity,         // create initial city
  armyMiddleware.getArmyMaxSize,              // calculate max army size
  armyMiddleware.getArmyPower,                // assign random army power
  armyController.createNewArmy,         // create initial army
  jwtMiddleware.generateToken,          // generate JWT
  jwtMiddleware.sendToken,              // send token back to client
  withMessage("Player created successfully", 201),
  sendResponse
);

router.post("/login", 
    userController.login, 
    bcryptMiddleware.comparePassword, 
    jwtMiddleware.generateToken, 
    jwtMiddleware.sendToken,
    withMessage("Logged in successfully", 201),
    sendResponse
);




module.exports = router;
