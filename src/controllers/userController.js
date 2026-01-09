const model = require("../models/userModel.js");

//Get all users
module.exports.readAllUser = (req, res, next) => {
  const callback = (error, results, fields) => {
    if (error) {
      console.log("Error readAllUser:", error);
      return res
        .status(500)
        .json({ message: "Internal server error in getting all user" });
    } else {
      res.locals.allUser = results;
      next();
    }
  };

  model.selectAll(callback);
};

//Get user with ID
module.exports.readUserById = (req, res, next) => {
  const data = {
    user_id:
      req.params.user_id ||
      req.body.user_id ||
      res.locals.user?.id ||
      res.locals.challenge?.creator_id,
  };
  console.log("read user by Id");

  const callback = (error, results, fields) => {
    if (error) {
      res
        .status(500)
        .json({ message: "Internal server error in getting user by ID" });
    } else {
      if (results.length == 0) {
        res.status(404).json({ message: "User not found" });
      } else {
        res.locals.user = results[0];
        next();
      }
    }
  };

  model.selectById(data, callback);
};

//Check if user name is unique
module.exports.checkUsernameUnique = (req, res, next) => {
  const username = req.body.username;

  if (username == undefined || req.body.city_name == undefined) {
    return res
      .status(400)
      .json({ message: "Username or cityname is undefined" });
  }

  const callback = (error, results) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    } else if (results.length > 0) {
      return res.status(409).json({ message: "username already exists" });
    } else next();
  };

  model.findByUsername(username, callback);
};

//Create new user
module.exports.createNewUser = (req, res, next) => {
  const data = {
    username: req.body.username,
  };

  const callback = (error, results) => {
    if (error) {
      return res.status(500).json({ message: "Error inserting user" });
    } else {
      res.locals.user = { id: results.insertId };
      next();
    }
  };

  model.insertSingle(data, callback);
};

//Update User
module.exports.updateUser = (req, res, next) => {
  if (req.body.username == undefined || req.body.points == undefined) {
    return res.status(400).json({ message: "Error: data is undefined" });
  }

  const data = {
    username: req.body.username,
    points: req.body.points,
    user_id: req.params.user_id,
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.log("Error updateUser:", error);
      return res.status(500).json(error);
    } else {
      if (results.affectedRows == 0) {
        return res.status(404).json({ message: "User not found" });
      } else next();
    }
  };

  model.updateUser(data, callback);
};

// Reduce user points after city creation
module.exports.reducePoint = (req, res, next) => {
  const userId = req.params.user_id;
  const newPoints = res.locals.newPoints;

  if (newPoints === undefined) {
    return res.status(400).json({ message: "No point deduction calculated" });
  }
  const data = { id: userId, points: newPoints };

  const callback = (error, results) => {
    if (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Internal server error in reducing points" });
    } else {
      res.locals.user.points = newPoints;
      next();
    }
  };

  model.updatePointsById(data, callback);
};

// Get user by city id which we get from army record
module.exports.readUserByArmy = (req, res, next) => {
  const data = { user_id: res.locals.userId };

  const callback = (error, results) => {
    if (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Internal server error in getting user by army" });
    }
    if (results.length == 0) {
      return res.status(404).json({ message: "User not found for this army" });
    } else {
      res.locals.user = results[0];
      next();
    }
  };

  model.selectById(data, callback);
};
