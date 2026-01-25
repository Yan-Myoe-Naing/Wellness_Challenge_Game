const express = require("express");
const router = express.Router();
const controller = require("../controllers/diplomacyController");
const userController = require("../controllers/userController");
const diplomacyMiddleware = require("../middlewares/diplomacyMiddleware")
const jwtMiddleware = require("../middlewares/jwtMiddleware")
const {
  withMessage,
  withDynamicMessage,
  sendResponse,
} = require("../middlewares/response");

// GET /diplomacies/
router.get(
  "/",
  controller.readAllDiplomacy,
  withMessage("All diplomacy details:", 200),
  sendResponse,
);

// GET /diplomacies/diplomacy_id
router.get(
  "/:diplomacy_id",
  controller.readDiplomacyById,
  withDynamicMessage(
    (req, res) => `Diplomacy ${req.params.diplomacy_id} details:`,
    200,
  ),
  sendResponse,
);

// GET /diplomacies/users/user
router.get(
  "/users/user",
  jwtMiddleware.verifyToken,
  userController.readUserById,
  controller.readDiplomacyByUserId,
  withDynamicMessage(
    (req, res) => `Diplomacy details of user ${res.locals.userId}:`,
    200,
  ),
  sendResponse,
);

//DELETE /diplomacies/diplomacy_id
router.delete(
  "/:diplomacy_id",
  jwtMiddleware.verifyToken,
  controller.readDiplomacyById,
  diplomacyMiddleware.verifyDiplomacyRelation,
  diplomacyMiddleware.validateForDeletion,
  controller.deleteDiplomacyById,
  withMessage("Diplomacy deleted:", 204),
  sendResponse,
);

module.exports = router;
