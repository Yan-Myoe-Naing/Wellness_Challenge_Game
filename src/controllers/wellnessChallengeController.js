const model = require("../models/wellnessChallengeModel.js");

//Create new challenge
module.exports.createNewChallenge = (req, res, next) => {
  if (
    req.body.description == undefined ||
    req.body.points == undefined
  ) {
    return res.status(400).json({ message: "Error: data is undefined" });
  }

  const data = {
    description: req.body.description,
    creator_id: res.locals.userId,
    points: req.body.points,
  };

  const callback = (error, results) => {
    if (error) {
      console.log(error)
      return res.status(500).json({ message: "Error inserting challenge" });
    } else {
      res.locals.challenge = { id: results.insertId };
      next();
    }
  };

  model.insertSingle(data, callback);
};

//Get challenge with ID
module.exports.readChallengeById = (req, res, next) => {
  const data = {
    challenge_id: req.params.challenge_id || res.locals.challenge.id,
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Internal server error in getting challenge by ID" });
    } else {
      if (results.length == 0) {
        res.status(404).json({ message: "Challenge not found" });
      } else {
        res.locals.challenge = results[0];
        next();
      }
    }
  };

  model.selectById(data, callback);
};

//2. Get all challenges
module.exports.readAllChallenges = (req, res, next) => {
  const callback = (error, results, fields) => {
    if (error) {
      console.log("Error readAllChallenges:", error);
      return res
        .status(500)
        .json({ message: "Internal server error in getting all challenges" });
    } else {
      res.locals.allChallenge = results;
      next();
    }
  };

  model.selectAll(callback);
};


//updateUser
module.exports.updateChallenge = (req, res, next) => {
  if (
    res.locals.userId == undefined ||
    req.body.description == undefined ||
    req.body.points == undefined
  ) {
    return res.status(400).json({ message: "Error: data is undefined" });
  }

  if (res.locals.challenge.creator_id != res.locals.userId) {
    return res
      .status(403)
      .json({ message: "Forbidden: not the challenge owner" });
  }

  const data = {
    creator_id: res.locals.userId,
    description: req.body.description,
    points: req.body.points,
    challenge_id: req.params.challenge_id,
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.log("Error updateChallenge:", error);
      return res.status(500).json(error);
    } else {
      if (results.affectedRows == 0) {
        return res.status(404).json({ message: "Challenge not found" });
      } else next();
    }
  };

  model.updateChallenge(data, callback);
};

//Create new completion
module.exports.createNewCompletion = (req, res, next) => {
  if (req.body.details == undefined) {
    return res.status(400).json({ message: "Error: data is undefined" });
  }

  const data = {
    user_id: res.locals.userId,
    details: req.body.details,
    challenge_id: req.params.challenge_id,
  };

  const callback = (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ message: "Error inserting challenge completion" });
    } else {
      res.locals.completion_id = results.insertId;
      next();
    }
  };

  model.insertCompletion(data, callback);
};

//Get challenge with ID
module.exports.readCompletionById = (req, res, next) => {
  const data = {
    completion_id: req.params.completion_id || res.locals.completion_id,
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(500).json({
        message: "Internal server error in getting challenge completion by ID",
      });
    } else {
      if (results.length == 0) {
        res.status(404).json({ message: "Challenge Completion not found" });
      } else {
        res.locals.completion = results[0];
        next();
      }
    }
  };

  model.selectCompletionById(data, callback);
};

//Add point to related users
module.exports.addPointsToUser = (req, res, next) => {
  const data = {
    user_id: res.locals.user.id || res.locals.userId,
    points: res.locals.challenge.points,
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Internal server error in adding points to user" });
    } else {
      res.locals.updatedPoints = data.points;
      next();
    }
  };

  model.addPointsByUserId(data, callback);
};

//Get all completion by challenge id
module.exports.readCompletionByChallengeId = (req, res, next) => {
  const data = { challenge_id: req.params.challenge_id };

  const callback = (error, results, fields) => {
    if (error) {
      console.log("Error readCompletionByChallengeId:", error);
      return res.status(500).json({
        message: "Internal server error in getting completion by challenge id",
      });
    } else {
      if (results.length == 0) {
        return res.status(404).json({ message: "Challenge not found" });
      } else {
        res.locals.completionByChallenge = results;
        next();
      }
    }
  };

  model.selectByChallengeId(data, callback);
};

// Get challenge overview in one call (raw)
module.exports.readOverviewRaw = (req, res, next) => {
  const data = { user_id: res.locals.userId };

  const callback = (error, results) => {
    if (error) {
      console.log("Error readOverviewRaw:", error);
      return res
        .status(500)
        .json({ message: "Internal server error in getting challenge overview" });
    }

    const [userRows, challengeRows, completionRows] = results;
    res.locals.user = userRows?.[0] || null;
    res.locals.challenges = challengeRows || [];
    res.locals.completions = completionRows || [];
    next();
  };

  model.selectOverview(data, callback);
};
