const express = require("express");
const router = express.Router();
const controller = require("../controllers/userCompletionController");
const {
  withMessage,
  withDynamicMessage,
  sendResponse,
} = require("../middlewares/response");

// GET /completions
router.get(
  "/",
  controller.readAllCompletion,
  withMessage("All completion details:", 200),
  sendResponse,
);

// GET /completions/completion_id
router.get(
  "/:completion_id",
  controller.readCompletionById,
  withDynamicMessage(
    (req, res) => `Completion ${req.params.completion_id} details:`,
    200,
  ),
  sendResponse,
);

// GET /userCompletions/users/{user_id}
router.get(
  "/users/:user_id",
  controller.readCompletionByUserId,
  withDynamicMessage(
    (req, res) => `Completion details of user ${req.params.user_id}:`,
    200,
  ),
  sendResponse,
);

module.exports = router;
