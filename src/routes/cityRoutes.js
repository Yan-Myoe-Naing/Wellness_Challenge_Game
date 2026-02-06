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
const { withMessage, withDynamicMessage, sendResponse } = require("../middlewares/response");


// GET /cities/overview
router.get(
  "/overview",
  jwtMiddleware.verifyToken,
  userController.readUserById,
  controller.readAllCity,
  controller.readWarTargetsByUserId,
  controller.readCityByUserIdAllowEmpty,
  armyController.readArmyByCityId,
  withMessage("City overview:", 200),
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

