const express = require("express");
const router = express.Router();
const controller = require("../controllers/battleController");
const diplomacyController = require("../controllers/diplomacyController");
const cityController = require("../controllers/cityController");
const armyController = require("../controllers/armyController");
const armyMiddleware = require("../middlewares/armyMiddleware");
const battleMiddleware = require("../middlewares/battleMiddleware");
const jwtMiddleware = require("../middlewares/jwtMiddleware")
const responseMiddleware = require("../middlewares/responseMiddleware");
const {
  withMessage,
  withDynamicMessage,
  sendResponse,
} = require("../middlewares/response");




/*
//POST/battles/armies/army_id
router.post(
  "/armies/:army_id",
  jwtMiddleware.verifyToken,
  armyController.readArmyById("attacker"),
  battleMiddleware.storeDefenderArmyId,
  armyController.readArmyById("defender"),
  cityController.readCityByArmy("attacker"),
  armyMiddleware.verifyArmyOwnershipForBattle,
  cityController.readCityByArmy("defender"),
  diplomacyController.readDiplomacyByUserId,
  battleMiddleware.validateDiplomacyStatus,
  battleMiddleware.calculateBattleResult,
  cityController.deleteCityById,
  armyController.deleteArmyById,
  cityController.updateCityById,
  armyController.updateArmyPower,
  armyController.reduceArmySize,
  controller.createNewBattle,
  controller.readBattleById,
  responseMiddleware.formatBattleResponse,
  withDynamicMessage(
    (req, res) =>
      `Battle initiated by army ${req.params.army_id}. Outcome: ${res.locals.battleResult}.`,
    201,
  ),
  sendResponse,
);
*/

//POST/battles/armies/army_id
router.post(
  "/armies/:army_id/capture",
  jwtMiddleware.verifyToken,
  armyController.readArmyById("attacker"),
  battleMiddleware.storeDefenderArmyId,
  armyController.readArmyById("defender"),
  cityController.readCityByArmy("attacker"),
  armyMiddleware.verifyArmyOwnershipForBattle,
  cityController.readCityByArmy("defender"),
  diplomacyController.readDiplomacyByUserId,
  battleMiddleware.validateDiplomacyStatus,
  battleMiddleware.calculateBattleResult,
  cityController.updateCityById,
  armyController.updateArmyPower,
  controller.createNewBattle("capture"),
  armyController.reduceArmySize,
  controller.readBattleById,
  responseMiddleware.formatBattleResponse,
  withDynamicMessage(
    (req, res) =>
      `Battle initiated by army ${req.params.army_id}. Outcome: ${res.locals.battleResult}.`,
    201,
  ),
  sendResponse,
);


//POST/battles/armies/army_id
router.post(
  "/armies/:army_id/destroy",
  jwtMiddleware.verifyToken,
  armyController.readArmyById("attacker"),
  battleMiddleware.storeDefenderArmyId,
  armyController.readArmyById("defender"),
  cityController.readCityByArmy("attacker"),
  armyMiddleware.verifyArmyOwnershipForBattle,
  cityController.readCityByArmy("defender"),
  diplomacyController.readDiplomacyByUserId,
  battleMiddleware.validateDiplomacyStatus,
  battleMiddleware.calculateBattleResult,
  cityController.deleteCityById,
  armyController.deleteArmyById,
  controller.createNewBattle("destroy"),
  armyController.reduceArmySize,
  controller.readBattleById,
  responseMiddleware.formatBattleResponse,
  withDynamicMessage(
    (req, res) =>
      `Battle initiated by army ${req.params.army_id}. Outcome: ${res.locals.battleResult}.`,
    201,
  ),
  sendResponse,
);







// GET /battles/
router.get(
  "/",
  controller.readAllBattle,
  withMessage("All battle details:", 200),
  sendResponse,
);

// GET /battles/battle_id
router.get(
  "/:battle_id",
  controller.readBattleById,
  withDynamicMessage(
    (req, res) => `Battle ${req.params.battle_id} details:`,
    200,
  ),
  sendResponse,
);

module.exports = router;
