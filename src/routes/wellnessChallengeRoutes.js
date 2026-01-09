const express = require("express");
const router = express.Router();
const controller = require("../controllers/wellnessChallengeController");
const userController = require("../controllers/userController");
const { withMessage, sendResponse } = require("../middlewares/response");

// 1. POST /challenges
router.post(
  "/",
  controller.createNewChallenge,
  controller.readChallengeById,
  withMessage("Challenge created successfully", 201),
  sendResponse,
);

//2. GET /challenges
router.get(
  "/",
  controller.readAllChallenges,
  withMessage("All challenges details:", 200),
  sendResponse,
);

//3. DELETE /challenges/{challenge_id}
router.delete(
  "/:challenge_id",
  controller.deleteChallengeById,
  withMessage("Challenge deleted", 204),
  sendResponse,
);

// 4. PUT /challenges/{challenge_id}
router.put(
  "/:challenge_id",
  controller.readChallengeById,
  controller.updateChallenge,
  controller.readChallengeById,
  withMessage("Challenge updated successfully", 200),
  sendResponse,
);

// 1. POST /challenges/{challenge_id}/
router.post(
  "/:challenge_id",
  controller.readChallengeById,
  userController.readUserById,
  controller.createNewCompletion,
  controller.addPointsToUser,
  controller.readCompletionById,
  withMessage("Challenge completed successfully", 201),
  sendResponse,
);

//2.  GET /challenges/{challenge_id}/
router.get(
  "/:challenge_id",
  controller.readCompletionByChallengeId,
  withMessage("All challenges details by challenge_id:", 200),
  sendResponse,
);

module.exports = router;
