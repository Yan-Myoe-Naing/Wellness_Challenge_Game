const express = require("express");
const router = express.Router();
const controller = require("../controllers/armyController");
const cityController = require("../controllers/cityController");
const userController = require("../controllers/userController");
const pointExchange = require("../services/pointServices");
const responseUtil = require("../utils/responseUtil");
const {
  withMessage,
  withDynamicMessage,
  sendResponse,
} = require("../middlewares/response");

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
  controller.readArmyById,
  withDynamicMessage((req, res) => `Army ${req.params.army_id} details:`, 200),
  sendResponse,
);

// GET /armies/users/{user_id}
router.get(
  "/users/:user_id",
  cityController.readCityByUserId,
  controller.readArmyByCityId,
  withDynamicMessage(
    (req, res) => `Army details of user ${req.params.user_id}:`,
    200,
  ),
  sendResponse,
);

// GET /armies/:army_id/getBuyableSize
router.get(
  "/:army_id/getBuyableSize",
  controller.readArmyById,
  cityController.readCityByArmy,
  userController.readUserByArmy,
  pointExchange.getExchangableArmySize,
  responseUtil.formatGetBuyableSizeResponse,
  withDynamicMessage(
    (req, res) => `Buyable army size for army ${req.params.army_id}:`,
    200,
  ),
  sendResponse,
);

// PUT /armies/:army_id/buySoldiers
router.put(
  "/:army_id/buySoldiers",
  controller.readArmyById,
  cityController.readCityByArmy,
  userController.readUserByArmy,
  pointExchange.getExchangableArmySize,
  pointExchange.changePointToSoldiers,
  userController.reducePoint,
  controller.updateArmyById,
  controller.readArmyById,
  responseUtil.formatBuySoldiersResponse,
  withDynamicMessage(
    (req, res) => `Army ${req.params.army_id} successfully bought soldiers.`,
    200,
  ),
  sendResponse,
);

module.exports = router;
