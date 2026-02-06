const express = require("express");
const router = express.Router();
const controller = require("../controllers/diplomacyRequestController");
const diplomacyController = require("../controllers/diplomacyController");
const diplomacyRequestMiddleware = require("../middlewares/diplomacyRequestMiddleware");
const jwtMiddleware = require("../middlewares/jwtMiddleware");
const responseMiddleware = require("../middlewares/responseMiddleware");
const { withMessage, withDynamicMessage, sendResponse } = require("../middlewares/response");


// POST /diplomacyRequests/war
router.post(
  "/war",
  jwtMiddleware.verifyToken,
  diplomacyRequestMiddleware.setSenderAsUser,
  diplomacyController.readDiplomacyByUserId,
  controller.readDiplomacyRequestByUserId,
  diplomacyRequestMiddleware.setReceiverAsUser,
  diplomacyController.readDiplomacyByUserId,
  controller.readDiplomacyRequestByUserId,
  diplomacyRequestMiddleware.checkTwoUsers,
  diplomacyRequestMiddleware.validateForWar,
  controller.createNewWar,
  diplomacyController.createNewWar,
  controller.readDiplomacyRequestById,
  diplomacyController.readDiplomacyById,
  responseMiddleware.formatDiplomacyRequestResponse,
  withDynamicMessage(
    (req, res) => `War declared against user ${req.body.target_id}.`,
    201,
  ),
  sendResponse,
);


// POST /diplomacyRequests/alliance
router.post(
  "/alliance",
  jwtMiddleware.verifyToken,
  diplomacyRequestMiddleware.setSenderAsUser,
  diplomacyController.readDiplomacyByUserId,
  controller.readDiplomacyRequestByUserId,
  diplomacyRequestMiddleware.setReceiverAsUser,
  diplomacyController.readDiplomacyByUserId,
  controller.readDiplomacyRequestByUserId,
  diplomacyRequestMiddleware.checkTwoUsers,
  diplomacyRequestMiddleware.validateForAlliance,
  controller.createNewDiplomacyRequest("alliance"),
  controller.readDiplomacyRequestById,
  responseMiddleware.formatDiplomacyRequestResponse,
  withDynamicMessage(
    (req, res) => `Alliance request created by user to user ${req.body.target_id}.`,
    201,
  ),
  sendResponse,
);


// POST /diplomacyRequests/peace
router.post(
  "/peace",
  jwtMiddleware.verifyToken,
  diplomacyRequestMiddleware.setSenderAsUser,
  diplomacyController.readDiplomacyByUserId,
  controller.readDiplomacyRequestByUserId,
  diplomacyRequestMiddleware.setReceiverAsUser,
  diplomacyController.readDiplomacyByUserId,
  controller.readDiplomacyRequestByUserId,
  diplomacyRequestMiddleware.checkTwoUsers,
  diplomacyRequestMiddleware.validateForPeace,
  controller.createNewDiplomacyRequest("peace"),
  controller.readDiplomacyRequestById,
  responseMiddleware.formatDiplomacyRequestResponse,
  withDynamicMessage(
    (req, res) => `Peace request created by user to user ${req.body.target_id}.`,
    201,
  ),
  sendResponse,
);


// PUT /diplomacyRequests/:request_id/accepted
router.put(
  "/:request_id/accepted",
  jwtMiddleware.verifyToken,
  controller.readDiplomacyRequestById,
  diplomacyRequestMiddleware.verifyRequestOwnership,
  diplomacyController.readDiplomacyByUserId,
  diplomacyRequestMiddleware.checkRequestStatus,
  controller.updateDiplomacyRequestById("accepted"),
  diplomacyRequestMiddleware.checkWarBetweenTwoUsers,
  diplomacyController.deleteDiplomacyById,
  diplomacyController.createNewDiplomacy,
  controller.readDiplomacyRequestById,
  diplomacyController.readDiplomacyById,
  responseMiddleware.formatDiplomacyAcceptResponse,
  withDynamicMessage(
    (req, res) => `Diplomacy request ${req.params.request_id} accepted.`,
    200,
  ),
  sendResponse,
);


// PUT /diplomacyRequests/:request_id/rejected
router.put(
  "/:request_id/rejected",
  jwtMiddleware.verifyToken,
  controller.readDiplomacyRequestById,
  diplomacyRequestMiddleware.verifyRequestOwnership,
  diplomacyRequestMiddleware.checkRequestStatus,
  controller.updateDiplomacyRequestById("rejected"),
  controller.readDiplomacyRequestById,
  responseMiddleware.formatDiplomacyAcceptResponse,
  withDynamicMessage(
    (req, res) => `Diplomacy request ${req.params.request_id} rejected.`,
    200,
  ),
  sendResponse,
);


// DELETE /diplomacyRequests/:request_id
router.delete(
  "/:request_id",
  jwtMiddleware.verifyToken,
  controller.readDiplomacyRequestById,
  diplomacyRequestMiddleware.verifyRequestSenderOwnership,
  controller.deleteRequestById,
  withDynamicMessage(
    (req, res) => `Diplomacy request ${req.params.request_id} deleted.`,
    200,
  ),
  sendResponse,
);

module.exports = router;
