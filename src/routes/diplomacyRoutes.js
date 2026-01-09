const express = require("express");
const router = express.Router();
const controller = require("../controllers/diplomacyController");
const userController = require("../controllers/userController");
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

// GET /diplomacies/users/{user_id}
router.get(
  "/users/:user_id",
  userController.readUserById,
  controller.readDiplomacyByUserId,
  withDynamicMessage(
    (req, res) => `Diplomacy details of user ${req.params.user_id}:`,
    200,
  ),
  sendResponse,
);

//DELETE /diplomacies/diplomacy_id
router.delete(
  "/:diplomacy_id",
  controller.deleteDiplomacyById,
  withMessage("Diplomacy deleted:", 204),
  sendResponse,
);

module.exports = router;
