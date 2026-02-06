const model = require("../models/diplomacyRequestModel");


// Read all diplomacy request.
module.exports.readAllDiplomacyRequest = (req, res, next) => {
  const callback = (error, results, fields) => {
    if (error) {
      console.log("Error readAllRequests:", error);
      return res.status(500).json({
          message: "Internal server error in getting all diplomacy requests",
        });
    } else {
      res.locals.allRequests = results;
      next();
    }
  };

  model.selectAll(callback);
};


// Read diplomacy request by id.
module.exports.readDiplomacyRequestById = (req, res, next) => {
  const data = {
    request_id: req.params.request_id || res.locals.requestId,
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.log(error);
      res
        .status(500)
        .json({
          message: "Internal server error in getting diplomacy request by ID",
        });
    } else {
      if (results.length == 0) {
        res.status(404).json({ message: "Diplomacy request not found" });
      } else {
        res.locals.senderId = results[0].sender_id;
        res.locals.request = results[0];
        next();
      }
    }
  };

  model.selectById(data, callback);
};


// Read diplomacy request by user id.
module.exports.readDiplomacyRequestByUserId = (req, res, next) => {
  const data = {
    user_id: res.locals.receiverId || res.locals.senderId,
  };

  const callback = (error, results) => {
    if (error) {
      return res.status(500).json({
          message: "Internal server error in getting request for user_id",
        });
    } else {
      if (res.locals.diplomacyRequestForUser == undefined) {
        res.locals.diplomacyRequestForUser = [];
      }

      res.locals.diplomacyRequestForUser =
        res.locals.diplomacyRequestForUser.concat(results);

      next();
    }
  };

  model.selectByUserId(data, callback);
};


// Read pending request by user id.
module.exports.readPendingRequestByUserId = (req, res, next) => {
  const data = {
    user_id: res.locals.receiverId || res.locals.senderId || res.locals.userId,
  };

  const callback = (error, results) => {
    if (error) {
      return res.status(500).json({
          message:
            "Internal server error in getting pending request for user_id",
        });
    } else {
      if (results.length === 0) {
        return res.status(404).json({
            message: "No pending diplomacy requests found for this user",
          });
      } else {
        if (res.locals.diplomacyRequestForUser == undefined) {
          res.locals.diplomacyRequestForUser = [];
        }

        res.locals.diplomacyRequestForUser =
          res.locals.diplomacyRequestForUser.concat(results);

        next();
      }
    }
  };

  model.selectPendingByUserId(data, callback);
};


// Create new diplomacy request.
module.exports.createNewDiplomacyRequest = (role) => (req, res, next) => {
  const senderId = res.locals.userId;
  const receiverId = req.body.target_id;
  const type = role;

  if (senderId == undefined || receiverId == undefined || type == undefined) {
    return res.status(400).json({ message: "sender_id, receiver_id, and type are required" });
  }

  const data = {
    sender_id: senderId,
    receiver_id: receiverId,
    type,
    status: "pending",
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error creating diplomacy request" });
    } else {
      res.locals.requestId = results.insertId;
      next();
    }
  };

  model.insertRequest(data, callback);
};


// Create new war.
module.exports.createNewWar = (req, res, next) => {
  if (res.locals.userId == undefined || req.body.target_id == undefined) {
    return res.status(400).json({ message: "sender_id and receiver_id are required" });
  }

  const data = {
    sender_id: res.locals.userId,
    receiver_id: req.body.target_id,
    type: "war",
    status: "accepted",
  };

  const callback = (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error declaring war" });
    }
    res.locals.requestId = results.insertId;
    next();
  };

  model.insertRequest(data, callback);
};


// Update diplomacy request by id.
module.exports.updateDiplomacyRequestById = (role) => (req, res, next) => {
  const data = {
    request_id: req.params.request_id || res.locals.requestId,
    status: role, 
  };

  const callback = (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error updating diplomacy request" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Diplomacy request not found" });
    }
    next();
  };

  model.updateById(data, callback);
};


// Delete request by id.
module.exports.deleteRequestById = (req, res, next) => {
  const data = { request_id: req.params.request_id };

  const callback = (error, results) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error deleting request" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Diplomacy request not found" });
    }
    next();
  };

  model.deleteById(data, callback);
};





