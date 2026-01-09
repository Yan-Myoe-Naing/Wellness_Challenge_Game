const express = require("express");
const router = express.Router();
const controller = require("../controllers/battleController");
const diplomacyController = require("../controllers/diplomacyController");
const cityController = require("../controllers/cityController");
const armyController = require("../controllers/armyController");
const battleUtil = require("../utils/battleUtil");
const responseUtil = require("../utils/responseUtil");
const {
  withMessage,
  withDynamicMessage,
  sendResponse,
} = require("../middlewares/response");

//POST/battles/armies/army_id
router.post(
  "/armies/:army_id",
  armyController.readArmyById("attacker"),
  battleUtil.storeDefenderArmyId,
  armyController.readArmyById("defender"),
  cityController.readCityByArmy("attacker"),
  cityController.readCityByArmy("defender"),
  diplomacyController.readDiplomacyByUserId,
  battleUtil.validateDiplomacyStatus,
  battleUtil.calculateBattleResult,

  // --- Branch: Attacker wins destroy ---
  (req, res, next) => {
    if (
      res.locals.battleResult === "attackerWins" &&
      req.body.action === "destroy"
    ) {
      // capture IDs before deletion
      res.locals.defenderArmyId = res.locals.defenderArmy.id;
      res.locals.defenderCityId = res.locals.defenderCity.id;

      // delete defender assets
      return cityController.deleteCityById(req, res, (err) => {
        if (err) return next(err);
        armyController.deleteArmyById(req, res, next);
      });
    }
    next();
  },

  // --- Branch: Attacker wins capture ---
  (req, res, next) => {
    if (
      res.locals.battleResult === "attackerWins" &&
      req.body.action === "capture"
    ) {
      return cityController.updateCityById(req, res, next);
    }
    next();
  },

  // --- Branch: Defender wins ---
  (req, res, next) => {
    if (res.locals.battleResult === "defenderWins") {
      return armyController.updateArmyPower(req, res, next);
    }
    next();
  },

  // --- Common flow ---
  armyController.reduceArmySize,
  controller.createNewBattle,
  controller.readBattleById,
  responseUtil.formatBattleResponse,
  withDynamicMessage(
    (req, res) =>
      `Battle initiated by army ${req.params.army_id}. Outcome: ${res.locals.battleResult}.`,
    201,
  ),
  sendResponse,
);

// GET /battles/history
router.get(
  "/history",
  controller.readBattleHistory,
  withMessage("All battle history:", 200),
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
