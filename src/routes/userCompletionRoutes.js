const express = require("express");
const router = express.Router();
const controller = require("../controllers/userCompletionController");
const jwtMiddleware = require("../middlewares/jwtMiddleware");
const pointServices = require("../middlewares/pointServices");
const authValidation = require("../middlewares/authValidation");
const { withMessage, sendResponse } = require("../middlewares/response");


// DELETE /userCompletions/:completion_id
router.delete(
  "/:completion_id",
  jwtMiddleware.verifyToken,
  controller.readCompletionById,
  authValidation.verifyCompletionOwnership,
  controller.readChallengeByIdForCompletion,
  controller.readUserForCompletion,
  pointServices.validatePointsForCompletionDelete,
  controller.deductPoints,
  controller.deleteCompletionById,
  withMessage("Completion deleted", 200),
  sendResponse
);

module.exports = router;
