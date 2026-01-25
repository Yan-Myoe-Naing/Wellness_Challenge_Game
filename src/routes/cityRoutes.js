const express = require("express");
const router = express.Router();
const controller = require("../controllers/cityController");
const userController = require("../controllers/userController");
const armyController = require("../controllers/armyController");
const pointExchange = require("../middlewares/pointServices");
const cityMiddleware = require("../middlewares/cityMiddleware");
const armyMiddleware = require("../middlewares/armyMiddleware");
const jwtMiddleware = require("../middlewares/jwtMiddleware")
const responseMiddleware = require("../middlewares/responseMiddleware");
const {
  withMessage,
  withDynamicMessage,
  sendResponse,
} = require("../middlewares/response");

// GET /cities
router.get(
  "/",
  controller.readAllCity,
  withMessage("All city details:", 200),
  sendResponse,
);

// GET /cities/city_id
router.get(
  "/:city_id",
  controller.readCityById,
  withDynamicMessage((req, res) => `City ${req.params.city_id} details:`, 200),
  sendResponse,
);

// GET /cities/users
router.get(
  "/users/user",
  jwtMiddleware.verifyToken,
  userController.readUserById,
  controller.readCityByUserId,
  withDynamicMessage(
    (req, res) => `City details of user ${res.locals.userId}:`,
    200,
  ),
  sendResponse,
);

// POST /cities
router.post(
  "/",
  jwtMiddleware.verifyToken,
  userController.readSelf,
  pointExchange.changePointToCity,
  userController.reducePoint,
  cityMiddleware.getPopulation,
  controller.createNewCity,
  armyMiddleware.getArmyMaxSize,
  armyMiddleware.getArmyPower,
  armyController.createNewArmy,
  controller.readCityById,
  armyController.readArmyById("army"),
  responseMiddleware.formatCreateCityResponse,
  withDynamicMessage(
    (req, res) =>
      `City '${res.locals.city.name}' created successfully for user ${res.locals.city.owner_id}`,
    201,
  ),
  sendResponse,
);

module.exports = router;
