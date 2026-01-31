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
      res.locals.userId ||
      res.locals.user?.id ||
      res.locals.challenge?.creator_id,
  };

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

//Get user with ID
module.exports.readSelf = (req, res, next) => {
  const data = {
    user_id:
      res.locals.userId
      };

  const callback = (error, results, fields) => {
    if (error) {
      res
        .status(500)
        .json({ message: "Internal server error in getting user by token" });
    } else {
        res.locals.user = results[0];
        next();
    }
  };

  model.selectSelf(data, callback);
};

// Get users overview (raw data)
module.exports.readOverview = (req, res, next) => {
  const callback = (error, results) => {
    if (error) {
      console.log("Error readOverview:", error);
      return res
        .status(500)
        .json({ message: "Internal server error in getting users overview" });
    }

    const [userRows, diplomacyRows] = results;
    res.locals.users = userRows || [];
    res.locals.diplomacies = diplomacyRows || [];
    next();
  };

  model.selectOverview(callback);
};


// Get full profile data in one call
module.exports.readProfile = (req, res, next) => {
  const data = { user_id: res.locals.userId };

  const callback = (error, results) => {
    if (error) {
      console.log("Error readProfile:", error);
      return res
        .status(500)
        .json({ message: "Internal server error in getting profile data" });
    }

    const [
      userRows,
      cityRows,
      armyRows,
      diplomacyRows,
      pendingRequestRows,
    ] = results;

    res.locals.profile = {
      user: userRows?.[0] || null,
      cities: cityRows || [],
      armies: armyRows || [],
      diplomacies: diplomacyRows || [],
      pendingRequests: pendingRequestRows || [],
    };

    next();
  };

  model.selectProfile(data, callback);
};


//Check if user name is unique
module.exports.checkUsernameUnique = (req, res, next) => {
  const username = req.body.username;

  if (username == undefined) {
    return res
      .status(400)
      .json({ message: "Username is undefined" });
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


module.exports.createNewUser = (req, res, next) => {

  const data = {
    username: req.body.username,
    password_hash: res.locals.hash   
  };

  const callback = (error, results) => {
    if (error) {
      console.log(error)
      return res.status(500).json({ message: "Error inserting user" });
    } else {
      res.locals.userId = results.insertId;
      res.locals.user = { id: results.insertId, username: req.body.username };
      next();
    }
  };

  model.insertSingle(data, callback);
};


//Update User
module.exports.updateUser = (req, res, next) => {
  if (req.body.username == undefined) {
    return res.status(400).json({ message: "Error: data is undefined" });
  }

  const data = {
    username: req.body.username,
    user_id: res.locals.userId,
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
  const userId = res.locals.userId;
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

  model.selectSelf(data, callback);
};


// Login
// This retrieves related User data by username for comparing later
module.exports.login = (req, res, next) => {

    // 400 Check for all expected input 
    if (req.body.username == undefined ||
        req.body.password == undefined) {
        return res.status(400).json({message: "Username or password is missing."});
    }

    // We only need username to get all the User data first
    const data = {
        username: req.body.username
    };


    const callback = (error, results) => {

        if (error) {
            console.log(error);
            return res.status(500).json({message: "Internal server error"});
        } 
        
        else {
            
            // If results.length == 0, that means no such user was found.
            if (results.length == 0) {
                return res.status(404).json({message: "User not found"});
            } 

            else {
                // For comparePassword: hashed password is saved into res.locals.hash
                res.locals.hash = results[0].password_hash;
                // For generateToken: Matching userId for input username is saved. 
                res.locals.userId = results[0].id;

                next();
            }
        }
    };
  
    model.selectUserByUsername(data, callback);
};
