const model = require("../models/userCompletionModel");
const challengeModel = require("../models/wellnessChallengeModel");
const userModel = require("../models/userModel");


// Read completion by id.
module.exports.readCompletionById = (req, res, next) => {
  const data = {
    completion_id: req.params.completion_id,
  };

  const callback = (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ message: "Internal server error in getting completion by ID" });
    }

    if (!results.length) {
      return res.status(404).json({ message: "Completion not found" });
    }

    res.locals.completion = results[0];
    next();
  };

  model.selectById(data, callback);
};


// Read challenge by id for completion.
module.exports.readChallengeByIdForCompletion = (req, res, next) => {
  const data = {
    challenge_id: res.locals.completion.challenge_id,
  };

  const callback = (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ message: "Internal server error in getting challenge by ID" });
    }

    if (!results.length) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    res.locals.challenge = results[0];
    next();
  };

  challengeModel.selectById(data, callback);
};


// Read user for completion.
module.exports.readUserForCompletion = (req, res, next) => {
  const data = {
    user_id: res.locals.userId,
  };

  const callback = (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ message: "Internal server error in getting user by token" });
    }

    if (!results.length) {
      return res.status(404).json({ message: "User not found" });
    }

    res.locals.user = results[0];
    next();
  };

  userModel.selectSelf(data, callback);
};


// Deduct points.
module.exports.deductPoints = (req, res, next) => {
  const data = {
    id: res.locals.userId,
    points: res.locals.newPoints,
  };

  const callback = (error) => {
    if (error) {
      return res
        .status(500)
        .json({ message: "Internal server error in reducing points" });
    }

    next();
  };

  userModel.updatePointsById(data, callback);
};


// Delete completion by id.
module.exports.deleteCompletionById = (req, res, next) => {
  const data = {
    completion_id: req.params.completion_id,
  };

  const callback = (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ message: "Internal server error deleting completion" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Completion not found" });
    }

    next();
  };

  model.deleteById(data, callback);
};
