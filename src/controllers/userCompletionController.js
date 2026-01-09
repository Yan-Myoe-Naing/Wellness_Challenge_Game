const model = require("../models/userCompletionModel.js");

// Get all challenges
module.exports.readAllCompletion = (req, res, next) => {
  const callback = (error, results, fields) => {
    if (error) {
      console.log("Error readAllCompletion:", error);
      return res
        .status(500)
        .json({ message: "Internal server error in getting all completions" });
    } else {
      res.locals.allCompletion = results;
      next();
    }
  };

  model.selectAll(callback);
};

//Get completion with ID
module.exports.readCompletionById = (req, res, next) => {
  const data = {
    completion_id: req.params.completion_id,
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Internal server error in getting completion by ID" });
    } else {
      if (results.length == 0) {
        res.status(404).json({ message: "Completion not found" });
      } else {
        res.locals.completion = results[0];
        next();
      }
    }
  };

  model.selectById(data, callback);
};

//Get completion with user_id
module.exports.readCompletionByUserId = (req, res, next) => {
  const data = {
    user_id: req.params.user_id || res.locals.user.id,
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.log(error);
      res
        .status(500)
        .json({
          message: "Internal server error in getting completion by user_id",
        });
    } else {
      if (results.length == 0) {
        res.status(404).json({ message: "User or completion not found" });
      } else {
        res.locals.completionByUser = results;
        next();
      }
    }
  };

  model.selectByUserId(data, callback);
};
