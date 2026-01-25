const express = require("express");
const router = express.Router();
const controller = require("../controllers/armyController");
const cityController = require("../controllers/cityController");
const userController = require("../controllers/userController");
const pointExchange = require("../middlewares/pointServices");
const jwtMiddleware = require("../middlewares/jwtMiddleware");
const armyMiddleware = require("../middlewares/armyMiddleware")
const responseMiddleware = require("../middlewares/responseMiddleware");
const {
  withMessage,
  withDynamicMessage,
  sendResponse,
} = require("../middlewares/response");
const { verify } = require("jsonwebtoken");

// GET /armies
router.get(
  "/",
  controller.readAllArmy,
  withMessage("All army details:", 200),
  sendResponse,
);

// GET /armies/army_id
router.get(
  "/:army_id",
  controller.readArmyById(""),
  withDynamicMessage((req, res) => `Army ${req.params.army_id} details:`, 200),
  sendResponse,
);

// GET /armies/users/user
router.get(
  "/users/user",
  jwtMiddleware.verifyToken,
  cityController.readCityByUserId,
  controller.readArmyByCityId,
  withDynamicMessage(
    (req, res) => `Army details of user ${res.locals.userId}:`,
    200,
  ),
  sendResponse,
);

// GET /armies/:army_id/getBuyableSize
router.get(
  "/:army_id/getBuyableSize",
  jwtMiddleware.verifyToken,
  controller.readArmyById(""),
  cityController.readCityByArmy(""),
  armyMiddleware.verifyArmyOwnership,
  userController.readSelf,
  pointExchange.getExchangableArmySize,
  responseMiddleware.formatGetBuyableSizeResponse,
  withDynamicMessage(
    (req, res) => `Buyable army size for army ${req.params.army_id}:`,
    200,
  ),
  sendResponse,
);

// PUT /armies/:army_id/buySoldiers
router.put(
  "/:army_id/buySoldiers",
  jwtMiddleware.verifyToken,
  controller.readArmyById(""),
  cityController.readCityByArmy(""),
  armyMiddleware.verifyArmyOwnership,
  userController.readUserByArmy,
  pointExchange.getExchangableArmySize,
  pointExchange.changePointToSoldiers,
  userController.reducePoint,
  controller.updateArmyById,
  controller.readArmyById(""),
  responseMiddleware.formatBuySoldiersResponse,
  withDynamicMessage(
    (req, res) => `Army ${req.params.army_id} successfully bought soldiers.`,
    200,
  ),
  sendResponse,
);

module.exports = router;
