const model = require("../models/diplomacyModel");

// Get all diplomacies
module.exports.readAllDiplomacy = (req, res, next) => {
  const callback = (error, results, fields) => {
    if (error) {
      console.log("Error readAllDiplomacy:", error);
      return res
        .status(500)
        .json({ message: "Internal server error in getting all diplomacies" });
    } else {
      res.locals.allDiplomacies = results;
      next();
    }
  };

  model.selectAll(callback);
};

//Get diplomacy with ID
module.exports.readDiplomacyById = (req, res, next) => {
  const data = {
    diplomacy_id: req.params.diplomacy_id || res.locals.diplomacyId,
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Internal server error in getting diplomacy by ID" });
    } else {
      if (results.length == 0) {
        res.status(404).json({ message: "Diplomacy not found" });
      } else {
        res.locals.diplomacy = results[0];
        next();
      }
    }
  };

  model.selectById(data, callback);
};

//Get diplomacy with user_id
module.exports.readDiplomacyByUserId = (req, res, next) => {
  const data = {
    user_id:
      res.locals.receiverId ||
      res.locals.senderId ||
      res.locals.attackerUserId ||
      res.locals.userId
  };
  const callback = (error, results, fields) => {
    if (error) {
      console.log(error);
      res
        .status(500)
        .json({
          message: "Internal server error in getting diplomacy by user_id",
        });
    } else {
        if (res.locals.senderId === data.user_id) {
          res.locals.senderDiplomacy = results;
          if (res.locals.diplomacyForUser == undefined) {
          res.locals.diplomacyForUser = [];
          res.locals.diplomacyForUser =
          res.locals.diplomacyForUser.concat(results);
          }
        
        } else if (res.locals.receiverId === data.user_id) {
          res.locals.receiverDiplomacy = results;
        res.locals.diplomacyForUser =
        res.locals.diplomacyForUser.concat(results);

          
        } else {
          res.locals.diplomacy = results;
        }
        next();
      
    }
  };

  model.selectByUserId(data, callback);
};

// Get diplomacy overview in one call (raw)
module.exports.readOverview = (req, res, next) => {
  const data = { user_id: res.locals.userId };

  const callback = (error, results) => {
    if (error) {
      console.log("Error readOverview:", error);
      return res
        .status(500)
        .json({ message: "Internal server error in getting diplomacy overview" });
    }

    const [allRows, userRows, pendingRows] = results;
    res.locals.allDiplomacies = allRows || [];
    res.locals.myDiplomacies = userRows || [];
    res.locals.pendingRequests = pendingRows || [];
    next();
  };

  model.selectOverview(data, callback);
};

// Create new war record
module.exports.createNewWar = (req, res, next) => {
  const senderId = res.locals.userId;
  const receiverId = req.body.target_id;

  if (senderId == undefined || receiverId == undefined) {
    return res
      .status(400)
      .json({ message: "sender_id and receiver_id are required" });
  }

  const data = {
    initiator_id: senderId,
    responder_id: receiverId,
    status: "war",
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Internal server error creating war record" });
    } else {
      res.locals.diplomacyId = results.insertId;
      next();
    }
  };

  model.insertDiplomacy(data, callback);
};

// Create new diplomacy record(alliance or peace)
module.exports.createNewDiplomacy =  (req, res, next) => {
  const { sender_id, receiver_id, type } = res.locals.request;

  const data = {
    initiator_id: sender_id,
    responder_id: receiver_id,
    status: type,
  };

  const callback = (error, results) => {
    if (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Internal server error creating diplomacy" });
    } else {
      res.locals.diplomacyId = results.insertId;
      next();
    }
  };

  model.insertDiplomacy(data, callback);
};

// Delete diplomacy by id
module.exports.deleteDiplomacyById = (req, res, next) => {
  const diplomacyId = res.locals.warId || req.params.diplomacy_id;

  if (diplomacyId == undefined) {
    // Nothing to delete
    return next();
  }

  const data = { diplomacy_id: diplomacyId };

  const callback = (error, results) => {
    if (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Internal server error deleting diplomacy" });
    }
    if (req.method === "DELETE") {
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Diplomacy record not found" });
      }
      return res.status(200).json({message: "Diplomacy deleted"});
    }
    next();
  };

  model.deleteById(data, callback);
};
