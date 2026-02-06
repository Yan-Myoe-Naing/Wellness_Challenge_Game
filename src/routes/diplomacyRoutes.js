const express = require("express");
const router = express.Router();
const controller = require("../controllers/diplomacyController");
const userController = require("../controllers/userController");
const diplomacyMiddleware = require("../middlewares/diplomacyMiddleware")
const jwtMiddleware = require("../middlewares/jwtMiddleware")
const { withMessage, withDynamicMessage, sendResponse } = require("../middlewares/response");


// GET /diplomacies/overview
router.get(
  "/overview",
  jwtMiddleware.verifyToken,
  controller.readOverview,
  withMessage("Diplomacy overview:", 200),
  sendResponse,
);


// DELETE /diplomacies/:diplomacy_id
router.delete(
  "/:diplomacy_id",
  jwtMiddleware.verifyToken,
  controller.readDiplomacyById,
  diplomacyMiddleware.verifyDiplomacyRelation,
  diplomacyMiddleware.validateForDeletion,
  controller.deleteDiplomacyById,
  withMessage("Diplomacy deleted:", 200),
  sendResponse,
);

module.exports = router;

