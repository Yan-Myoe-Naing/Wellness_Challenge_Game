const express = require("express");
const router = express.Router();
const controller = require("../controllers/userCompletionController");
const jwtMiddleware = require("../middlewares/jwtMiddleware")
const {
  withMessage,
  withDynamicMessage,
  sendResponse,
} = require("../middlewares/response");
const { JsonWebTokenError } = require("jsonwebtoken");

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

// GET /userCompletions/users/user
router.get(
  "/users/user",
  jwtMiddleware.verifyToken,
  controller.readCompletionByUserId,
  withDynamicMessage(
    (req, res) => `Completion details of user ${res.locals.userId}:`,
    200,
  ),
  sendResponse,
);

module.exports = router;
