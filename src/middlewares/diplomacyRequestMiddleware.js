// Set sender user ID from route parameter
module.exports.setSenderAsUser = (req, res, next) => {
  const senderId = res.locals.userId;
  if (senderId == undefined) {
    return res.status(400).json({ message: "sender_id is required" });
  }
  res.locals.senderId = senderId;
  next();
};

// Set receiver user ID from request body
module.exports.setReceiverAsUser = (req, res, next) => {
  const receiverId = req.body.target_id;
  if (receiverId == undefined) {
    return res.status(400).json({ message: "receiver_id is required" });
  }
  res.locals.receiverId = receiverId;
  next();
};

// Ensure sender and receiver are not the same user
module.exports.checkTwoUsers = (req, res, next) => {
  const senderId = res.locals.userId; // comes from URL
  const receiverId = req.body.target_id; // comes from request body

  if (senderId == receiverId) {
    return res
      .status(400)
      .json({ message: "Sender and receiver cannot be the same user" });
  }

  res.locals.senderId = senderId;
  res.locals.receiverId = receiverId;

  next();
};

// Validate alliance request rules
module.exports.validateForAlliance = (req, res, next) => {
  const senderId = parseInt(res.locals.senderId, 10);
  const receiverId = parseInt(res.locals.receiverId, 10);

  const senderRecords = res.locals.senderDiplomacy || [];
  const receiverRecords = res.locals.receiverDiplomacy || [];
  const pendingRequests = res.locals.diplomacyRequestForUser || [];

  // Block if sender already has an alliance
  const senderAlliance = senderRecords.find((r) => r.status === "alliance");
  if (senderAlliance) {
    return res
      .status(409)
      .json({ message: "Sender already has an alliance with another user" });
  }

  // Block if receiver already has an alliance
  const receiverAlliance = receiverRecords.find((r) => r.status === "alliance");
  if (receiverAlliance) {
    return res
      .status(409)
      .json({ message: "Receiver already has an alliance with another user" });
  }

  // Block if pending alliance request already exists in either direction
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
      return res
        .status(409)
        .json({
          message: "Alliance request already pending from sender to receiver",
        });
    }

    if (
      isPendingAlliance &&
      reqSender === receiverId &&
      reqReceiver === senderId
    ) {
      return res
        .status(409)
        .json({
          message: "Alliance request already pending from receiver to sender",
        });
    }
  }

  next();
};

// Validate peace request rules
module.exports.validateForPeace = (req, res, next) => {
  const senderId = parseInt(res.locals.senderId, 10);
  const receiverId = parseInt(res.locals.receiverId, 10);
  const pendingRequests = res.locals.diplomacyRequestForUser || [];

  // Block if pending peace request already exists in either direction
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
      return res
        .status(409)
        .json({
          message: "Peace request already pending from sender to receiver",
        });
    }

    if (
      isPendingPeace &&
      reqSender === receiverId &&
      reqReceiver === senderId
    ) {
      return res
        .status(409)
        .json({
          message: "Peace request already pending from receiver to sender",
        });
    }
  }

  next();
};

// Validate war request rules
module.exports.validateForWar = (req, res, next) => {
  const senderId = res.locals.userId;
  const receiverId = req.body.target_id;
  const existingRequests = res.locals.diplomacyRequestForUser || [];
const existingDiplomacy = res.locals.diplomacyForUser || [];

  // Block if alliance or peace treaty already exists
  
  const allianceOrPeace = existingDiplomacy.find(
    (reqItem) =>
      ((reqItem.initiator_id == senderId && reqItem.responder_id == receiverId) ||
        (reqItem.initiator_id == receiverId && reqItem.responder_id == senderId)) &&
      (reqItem.status === "alliance" || reqItem.status === "peace")  );

  if (allianceOrPeace) {
    return res
      .status(409)
      .json({
        message: "Cannot declare war while alliance or peace treaty exists",
      });
  }

  // Block if war already exists
  const war = existingDiplomacy.find(
    (reqItem) =>
      ((reqItem.initiator_id == senderId && reqItem.responder_id == receiverId) ||
        (reqItem.initiator_id == receiverId && reqItem.responder_id == senderId)) &&
      reqItem.status === "war"  );

  if (war) {
    return res
      .status(409)
      .json({ message: "War already exists between these users" });
  }

  next();
};

// Ensure diplomacy request is still pending before processing
module.exports.checkRequestStatus = (req, res, next) => {
  const request = res.locals.request;

  if (request.status !== "pending") {
    return res
      .status(409)
      .json({ message: "Diplomacy request already processed" });
  }

  next();
};

// Check if war already exists between two users
module.exports.checkWarBetweenTwoUsers = (req, res, next) => {
  const { sender_id, receiver_id } = res.locals.request;

  const warRecord = (res.locals.senderDiplomacy || []).find(
    (d) =>
      d.status === "war" &&
      ((d.initiator_id === sender_id && d.responder_id === receiver_id) ||
        (d.initiator_id === receiver_id && d.responder_id === sender_id)),
  );

  // Flag if war exists
  res.locals.hasWar = !!warRecord;

  // Store war record ID if found, else null
  res.locals.warId = warRecord ? warRecord.id : null;
  next();
};


// Verify Request Ownership as reciever
module.exports.verifyRequestOwnership = (req, res, next) => {
  if (res.locals.request?.receiver_id != res.locals.userId) {
    return res.status(403).json({ message: "You cannot accept or reject this request" });
  }
  next();
};
