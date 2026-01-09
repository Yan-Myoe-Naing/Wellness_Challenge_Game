const express = require("express");
const router = express.Router();
const controller = require("../controllers/diplomacyRequestController");
const diplomacyController = require("../controllers/diplomacyController");
const diplomacyRequestUtil = require("../utils/diplomacyRequestUtil");
const responseUtil = require("../utils/responseUtil");
const {
  withMessage,
  withDynamicMessage,
  sendResponse,
} = require("../middlewares/response");

// GET /diplomacyRequests
router.get(
  "/",
  controller.readAllDiplomacyRequest,
  withMessage("All diplomacy request details:", 200),
  sendResponse,
);

// GET /diplomacyRequests/request_id
router.get(
  "/:request_id",
  controller.readDiplomacyRequestById,
  withDynamicMessage(
    (req, res) => `Diplomacy Request ${req.params.request_id} details:`,
    200,
  ),
  sendResponse,
);

// GET /diplomacyRequests/users/:user_id/pendingRequest
router.get(
  "/users/:user_id/pendingRequest",
  controller.readPendingRequestByUserId, // custom controller logic
  withDynamicMessage(
    (req, res) => `Pending diplomacy requests for user ${req.params.user_id}:`,
    200,
  ),
  sendResponse,
);

// POST /diplomacyRequests/users/:user_id/war
router.post(
  "/users/:user_id/war",
  diplomacyRequestUtil.setSenderAsUser,
  diplomacyController.readDiplomacyByUserId,
  controller.readDiplomacyRequestByUserId,
  diplomacyRequestUtil.setReceiverAsUser,
  diplomacyController.readDiplomacyByUserId,
  controller.readDiplomacyRequestByUserId,
  diplomacyRequestUtil.checkTwoUsers,
  diplomacyRequestUtil.validateForWar, // block if alliance/peace exists
  controller.createNewWar, // insert into DiplomacyRequest table
  diplomacyController.createNewWar, // insert into Diplomacy table
  controller.readDiplomacyRequestById,
  diplomacyController.readDiplomacyById,
  responseUtil.formatDiplomacyRequestResponse,
  withDynamicMessage(
    (req) =>
      `War declared by user ${req.params.user_id} against user ${req.body.target_id}.`,
    201,
  ),
  sendResponse,
);

// POST /diplomacyRequests/users/:user_id/:type
router.post(
  "/users/:user_id/:type",
  diplomacyRequestUtil.setSenderAsUser,
  diplomacyController.readDiplomacyByUserId,
  controller.readDiplomacyRequestByUserId,
  diplomacyRequestUtil.setReceiverAsUser,
  diplomacyController.readDiplomacyByUserId,
  controller.readDiplomacyRequestByUserId,
  diplomacyRequestUtil.checkTwoUsers,
  (req, res, next) => {
    if (req.params.type === "alliance") {
      return diplomacyRequestUtil.validateForAlliance(req, res, next);
    }
    if (req.params.type === "peace") {
      return diplomacyRequestUtil.validateForPeace(req, res, next);
    }
    return res.status(400).json({ message: "Invalid diplomacy type" });
  },
  controller.createNewDiplomacyRequest,
  controller.readDiplomacyRequestById,
  responseUtil.formatDiplomacyRequestResponse,
  withDynamicMessage(
    (req, res) =>
      `${req.params.type} request created by user ${req.params.user_id} to user ${req.body.target_id}.`,
    201,
  ),
  sendResponse,
);

//PUT /diplomacyRequests/:request_id/:status
router.put(
  "/:request_id/:status",
  controller.readDiplomacyRequestById,
  diplomacyRequestUtil.checkRequestStatus, // must be pending
  (req, res, next) => {
    // normalize status param
    const status = req.params.status;
    if (status !== "accepted" && status !== "rejected") {
      return res
        .status(400)
        .json({ message: "Invalid status. Must be 'accepted' or 'rejected'." });
    }
    res.locals.updateStatus = status;
    next();
  },
  controller.updateDiplomacyRequestById,
  (req, res, next) => {
    if (res.locals.updateStatus === "rejected") {
      return controller.readDiplomacyRequestById(req, res, () => {
        // after re-read, send response and STOP
        return res.json({
          message: `Diplomacy request ${req.params.request_id} rejected.`,
          data: { request: res.locals.request },
        });
      });
    }
    next();
  },
  diplomacyRequestUtil.checkWarBetweenTwoUsers,
  diplomacyController.deleteDiplomacyById,
  diplomacyController.createNewDiplomacy,
  controller.readDiplomacyRequestById, // re-read updated request
  diplomacyController.readDiplomacyById, // read new diplomacy record
  responseUtil.formatDiplomacyAcceptResponse,
  withDynamicMessage(
    (req, res) => `Diplomacy request ${req.params.request_id} accepted.`,
    200,
  ),
  sendResponse,
);

module.exports = router;
