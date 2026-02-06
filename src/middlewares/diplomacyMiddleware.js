// Set sender as user.
module.exports.setSenderAsUser = (req, res, next) => {
  const senderId = res.locals.userId;
  if (senderId == undefined) {
    return res.status(400).json({ message: "sender_id is required" });
  }
  res.locals.senderId = senderId;
  next();
};


// Set receiver as user.
module.exports.setReceiverAsUser = (req, res, next) => {
  const receiverId = req.body.target_id;
  if (receiverId == undefined) {
    return res.status(400).json({ message: "receiver_id is required" });
  }
  res.locals.receiverId = receiverId;
  next();
};


// Check two users.
module.exports.checkTwoUsers = (req, res, next) => {
  const senderId = res.locals.userId;
  const receiverId = req.body.target_id;

  if (senderId == receiverId) {
    return res.status(400).json({ message: "Sender and receiver cannot be the same user" });
  }

  res.locals.senderId = senderId;
  res.locals.receiverId = receiverId;

  next();
};


// Validate for alliance.
module.exports.validateForAlliance = (req, res, next) => {
  const senderId = parseInt(res.locals.senderId, 10);
  const receiverId = parseInt(res.locals.receiverId, 10);

  const senderRecords = res.locals.senderDiplomacy || [];
  const receiverRecords = res.locals.receiverDiplomacy || [];
  const pendingRequests = res.locals.diplomacyRequestForUser || [];
  const senderAlliance = senderRecords.find((r) => r.status === "alliance");
  if (senderAlliance) {
    return res.status(409).json({ message: "Sender already has an alliance with another user" });
  }
  const receiverAlliance = receiverRecords.find((r) => r.status === "alliance");
  if (receiverAlliance) {
    return res.status(409).json({ message: "Receiver already has an alliance with another user" });
  }
  for (const reqItem of pendingRequests) {
    const reqSender = parseInt(reqItem.sender_id, 10);
    const reqReceiver = parseInt(reqItem.receiver_id, 10);

    const isPendingAlliance =
      reqItem.status === "pending" && reqItem.type === "alliance";

    if (
      isPendingAlliance &&
      reqSender === senderId &&
      reqReceiver === receiverId
    ) {
      return res.status(409).json({
        message: "Alliance request already pending from sender to receiver",
      });
    }

    if (
      isPendingAlliance &&
      reqSender === receiverId &&
      reqReceiver === senderId
    ) {
      return res.status(409).json({
        message: "Alliance request already pending from receiver to sender",
      });
    }
  }

  next();
};


// Validate for peace.
module.exports.validateForPeace = (req, res, next) => {
  const senderId = parseInt(res.locals.senderId, 10);
  const receiverId = parseInt(res.locals.receiverId, 10);
  const pendingRequests = res.locals.diplomacyRequestForUser || [];
  for (const reqItem of pendingRequests) {
    const reqSender = parseInt(reqItem.sender_id, 10);
    const reqReceiver = parseInt(reqItem.receiver_id, 10);

    const isPendingPeace =
      reqItem.status === "pending" && reqItem.type === "peace";

    if (
      isPendingPeace &&
      reqSender === senderId &&
      reqReceiver === receiverId
    ) {
      return res.status(409).json({
        message: "Peace request already pending from sender to receiver",
      });
    }

    if (
      isPendingPeace &&
      reqSender === receiverId &&
      reqReceiver === senderId
    ) {
      return res.status(409).json({
        message: "Peace request already pending from receiver to sender",
      });
    }
  }

  next();
};


// Validate for war.
module.exports.validateForWar = (req, res, next) => {
  const senderId = res.locals.userId;
  const receiverId = req.body.target_id;
  const existingRequests = res.locals.diplomacyRequestForUser || [];
  const existingDiplomacy = res.locals.diplomacyForUser || [];

  const allianceOrPeace = existingDiplomacy.find(
    (reqItem) =>
      ((reqItem.initiator_id == senderId && reqItem.responder_id == receiverId) ||
        (reqItem.initiator_id == receiverId && reqItem.responder_id == senderId)) &&
      (reqItem.status === "alliance" || reqItem.status === "peace"),
  );

  if (allianceOrPeace) {
    return res.status(409).json({
      message: "Cannot declare war while alliance or peace treaty exists",
    });
  }
  const war = existingDiplomacy.find(
    (reqItem) =>
      ((reqItem.initiator_id == senderId && reqItem.responder_id == receiverId) ||
        (reqItem.initiator_id == receiverId && reqItem.responder_id == senderId)) &&
      reqItem.status === "war",
  );

  if (war) {
    return res.status(409).json({ message: "War already exists between these users" });
  }

  next();
};


// Check request status.
module.exports.checkRequestStatus = (req, res, next) => {
  const request = res.locals.request;

  if (request.status !== "pending") {
    return res.status(409).json({ message: "Diplomacy request already processed" });
  }

  next();
};


// Check war between two users.
module.exports.checkWarBetweenTwoUsers = (req, res, next) => {
  const { sender_id, receiver_id } = res.locals.request;

  const warRecord = (res.locals.senderDiplomacy || []).find(
    (d) =>
      d.status === "war" &&
      ((d.initiator_id === sender_id && d.responder_id === receiver_id) ||
        (d.initiator_id === receiver_id && d.responder_id === sender_id)),
  );
  res.locals.hasWar = !!warRecord;
  res.locals.warId = warRecord ? warRecord.id : null;
  next();
};


// Verify diplomacy relation.
module.exports.verifyDiplomacyRelation = (req, res, next) => {
  if (
    (res.locals.diplomacy?.initiator_id != res.locals.userId) &&
    (res.locals.diplomacy?.responder_id != res.locals.userId)
  ) {
    return res.status(403).json({ message: "You are not related to this diplomacy" });
  }

  next();
};


// Validate for deletion.
module.exports.validateForDeletion = (req, res, next) => {
  if (res.locals.diplomacy?.status == "war") {
    return res.status(403).json({ message: "You cannot end a war one sided" });
  }

  next();
};
