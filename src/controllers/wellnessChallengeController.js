const model = require("../models/wellnessChallengeModel.js");


// Create new challenge.
module.exports.createNewChallenge = (req, res, next) => {
  if (req.body.description == undefined || req.body.points == undefined) {
    return res.status(400).json({ message: "Error: data is undefined" });
  }

  const data = {
    description: req.body.description,
    creator_id: res.locals.userId,
    points: req.body.points,
  };

  const callback = (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ message: "Error inserting challenge" });
    }

    res.locals.challenge = { id: results.insertId };
    next();
  };

  model.insertSingle(data, callback);
};


// Read challenge by id.
module.exports.readChallengeById = (req, res, next) => {
  const data = {
    challenge_id: req.params.challenge_id || res.locals.challenge?.id,
  };

  const callback = (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error in getting challenge by ID" });
    }

    if (results.length == 0) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    res.locals.challenge = results[0];
    next();
  };

  model.selectById(data, callback);
};


// Read all challenges.
module.exports.readAllChallenges = (req, res, next) => {
  const callback = (error, results) => {
    if (error) {
      console.log("Error readAllChallenges:", error);
      return res.status(500).json({ message: "Internal server error in getting all challenges" });
    }

    res.locals.allChallenge = results;
    next();
  };

  model.selectAll(callback);
};


// Update challenge.
module.exports.updateChallenge = (req, res, next) => {
  if (
    res.locals.userId == undefined ||
    req.body.description == undefined ||
    req.body.points == undefined
  ) {
    return res.status(400).json({ message: "Error: data is undefined" });
  }

  if (res.locals.challenge.creator_id != res.locals.userId) {
    return res.status(403).json({ message: "Forbidden: not the challenge owner" });
  }

  const data = {
    creator_id: res.locals.userId,
    description: req.body.description,
    points: req.body.points,
    challenge_id: req.params.challenge_id,
  };

  const callback = (error, results) => {
    if (error) {
      console.log("Error updateChallenge:", error);
      return res.status(500).json(error);
    }

    if (results.affectedRows == 0) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    next();
  };

  model.updateChallenge(data, callback);
};


// Create new completion.
module.exports.createNewCompletion = (req, res, next) => {
  if (!req.body || req.body.details == undefined) {
    return res.status(400).json({ message: "Error: data is undefined" });
  }

  const data = {
    user_id: res.locals.userId,
    details: req.body.details,
    challenge_id: req.params.challenge_id,
  };

  const callback = (error, results) => {
    if (error) {
      return res.status(500).json({ message: "Error inserting challenge completion" });
    }

    res.locals.completion_id = results.insertId;
    next();
  };

  model.insertCompletion(data, callback);
};


// Read completion by id.
module.exports.readCompletionById = (req, res, next) => {
  const data = {
    completion_id: req.params.completion_id || res.locals.completion_id,
  };

  const callback = (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal server error in getting challenge completion by ID",
      });
    }

    if (results.length == 0) {
      return res.status(404).json({ message: "Challenge Completion not found" });
    }

    res.locals.completion = results[0];
    next();
  };

  model.selectCompletionById(data, callback);
};


// Add points to user.
module.exports.addPointsToUser = (req, res, next) => {
  const data = {
    user_id: res.locals.user?.id || res.locals.userId,
    points: res.locals.challenge.points,
  };

  const callback = (error) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal server error in adding points to user",
      });
    }

    res.locals.updatedPoints = data.points;
    next();
  };

  model.addPointsByUserId(data, callback);
};


// Read completion by challenge id.
module.exports.readCompletionByChallengeId = (req, res, next) => {
  const data = {
    challenge_id: req.params.challenge_id,
  };

  const callback = (error, results) => {
    if (error) {
      console.log("Error readCompletionByChallengeId:", error);
      return res.status(500).json({
        message: "Internal server error in getting completion by challenge id",
      });
    }

    if (results.length == 0) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    res.locals.completionByChallenge = results;
    next();
  };

  model.selectCompletionByChallengeId(data, callback);
};


// Read overview raw.
module.exports.readOverviewRaw = (req, res, next) => {
  const data = { user_id: res.locals.userId };

  const callback = (error, results) => {
    if (error) {
      console.log("Error readOverviewRaw:", error);
      return res.status(500).json({
        message: "Internal server error in getting challenge overview",
      });
    }

    const [userRows, challengeRows, completionRows] = results;
    res.locals.user = userRows?.[0] || null;
    res.locals.challenges = challengeRows || [];
    res.locals.completions = completionRows || [];
    next();
  };

  model.selectOverview(data, callback);
};
