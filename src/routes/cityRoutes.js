const express = require("express");
const router = express.Router();
const controller = require("../controllers/cityController");
const userController = require("../controllers/userController");
const armyController = require("../controllers/armyController");
const pointExchange = require("../services/pointServices");
const cityUtil = require("../utils/cityUtil");
const armyUtil = require("../utils/armyUtil");
const responseUtil = require("../utils/responseUtil");
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

// GET /cities/users/{user_id}
router.get(
  "/users/:user_id",
  userController.readUserById,
  controller.readCityByUserId,
  withDynamicMessage(
    (req, res) => `City details of user ${req.params.user_id}:`,
    200,
  ),
  sendResponse,
);

// POST /cities/users/:user_id
router.post(
  "/users/:user_id",
  userController.readUserById,
  pointExchange.changePointToCity,
  userController.reducePoint,
  cityUtil.getPopulation,
  controller.createNewCity,
  armyUtil.getArmyMaxSize,
  armyUtil.getArmyPower,
  armyController.createNewArmy,
  controller.readCityById,
  armyController.readArmyById("army"),
  responseUtil.formatCreateCityResponse,
  withDynamicMessage(
    (req, res) =>
      `City '${res.locals.city.name}' created successfully for user ${res.locals.city.owner_id}`,
    201,
  ),
  sendResponse,
);

module.exports = router;
