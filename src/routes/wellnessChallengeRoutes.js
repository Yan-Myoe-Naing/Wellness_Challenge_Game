const express = require("express");
const router = express.Router();
const controller = require("../controllers/wellnessChallengeController");
const userController = require("../controllers/userController");
const jwtMiddleware = require("../middlewares/jwtMiddleware")
const { withMessage, sendResponse } = require("../middlewares/response");


// POST /challenges
router.post(
  "/",
  jwtMiddleware.verifyToken,
  controller.createNewChallenge,
  controller.readChallengeById,
  withMessage("Challenge created successfully", 201),
  sendResponse,
);


// GET /challenges/overview
router.get(
  "/overview",
  jwtMiddleware.verifyToken,
  controller.readOverviewRaw,
  withMessage("Challenge overview:", 200),
  sendResponse,
);


// POST /challenges/:challenge_id
router.post(
  "/:challenge_id",
  jwtMiddleware.verifyToken,
  controller.readChallengeById,
  userController.readUserById,
  controller.createNewCompletion,
  controller.addPointsToUser,
  controller.readCompletionById,
  withMessage("Challenge completed successfully", 201),
  sendResponse,
);

module.exports = router;

