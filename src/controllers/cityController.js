const model = require("../models/CityModel.js");

// Get all city
module.exports.readAllCity = (req, res, next) => {
  const callback = (error, results, fields) => {
    if (error) {
      console.log("Error readAllCity:", error);
      return res
        .status(500)
        .json({ message: "Internal server error in getting all cities" });
    } else {
      res.locals.allCity = results;
      next();
    }
  };

  model.selectAll(callback);
};

//Get city with ID
module.exports.readCityById = (req, res, next) => {
  const data = {
    city_id: req.params.city_id || res.locals.cityId,
  };
  const callback = (error, results, fields) => {
    if (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Internal server error in getting city by ID" });
    } else {
      if (results.length == 0) {
        res.status(404).json({ message: "City not found" });
      } else {
        res.locals.city = results[0];
        next();
      }
    }
  };

  model.selectById(data, callback);
};

//Get city with user_id
module.exports.readCityByUserId = (req, res, next) => {
  const data = {
    user_id: res.locals.user?.id || res.locals.userId,
  };
  const callback = (error, results, fields) => {
    if (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Internal server error in getting city by user_id" });
    } else {
      if (results.length == 0) {
        res.status(404).json({ message: "No cities found for this user" });
      } else {
        res.locals.cityByUser = results;
        res.locals.cityCount = results.length;
        next();
      }
    }
  };

  model.selectByUserId(data, callback);
};

// Get cities by user id but allow empty list
module.exports.readCityByUserIdAllowEmpty = (req, res, next) => {
  const data = {
    user_id: res.locals.user?.id || res.locals.userId,
  };

  const callback = (error, results) => {
    if (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Internal server error in getting city by user_id" });
    }
    res.locals.cityByUser = results || [];
    res.locals.cityCount = res.locals.cityByUser.length;
    next();
  };

  model.selectByUserId(data, callback);
};

// Create new city for a user
module.exports.createNewCity = (req, res, next) => {
  if (req.body.city_name == undefined) {
    return res.status(400).json({ message: "City name is required" });
  }

  const data = {
    owner_id: res.locals.userId,
    name: req.body.city_name,
    population: res.locals.population,
  };

  const callback = (error, results) => {
    if (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Internal server error in creating city" });
    }
    res.locals.cityId = results.insertId;
    next();
  };

  model.insertCity(data, callback);
};

// Get city by army id
module.exports.readCityByArmy = (role) => (req, res, next) => {
  // choose army based on role or fallback
  let army;
  if (role === "attacker") {
    army = res.locals.attackerArmy;
  } else if (role === "defender") {
    army = res.locals.defenderArmy;
  } else {
    army = res.locals.army; // generic fallback
  }

  const data = { city_id: army.city_id };

  const callback = (error, results) => {
    if (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Internal server error in getting city by army" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "City not found" });
    }

    const city = results[0];
    const userId = city.owner_id;

    if (role === "attacker") {
      res.locals.attackerCity = city;
      res.locals.attackerUserId = userId;
    } else if (role === "defender") {
      res.locals.defenderCity = city;
      res.locals.defenderUserId = userId;
    } else {
      res.locals.city = city;
      //res.locals.userId = userId;
    }

    next();
  };

  model.selectById(data, callback);
};

// Delete city by id
module.exports.deleteCityById = (req, res, next) => {
  if (
      res.locals.battleResult != "attackerWins"
    ){return next()}
  const data = {
    city_id:
      res.locals.defenderCity?.id || res.locals.cityId || req.params.city_id,
  };

  const callback = (error, results) => {
    if (error) {
      console.log(error);
    }
    next();
  };

  model.deleteById(data, callback);
};

// Get war-eligible target cities
module.exports.readWarTargetsByUserId = (req, res, next) => {
  const data = { user_id: res.locals.userId || res.locals.user?.id };

  const callback = (error, results) => {
    if (error) {
      console.log("Error readWarTargetsByUserId:", error);
      return res
        .status(500)
        .json({ message: "Internal server error in getting war targets" });
    }
    res.locals.warTargets = results || [];
    next();
  };

  model.selectWarTargetsByUserId(data, callback);
};

// Update city by id
module.exports.updateCityById = (req, res, next) => {
  if (
      res.locals.battleResult != "attackerWins"
    ) {return next()}
  const data = {
    city_id:
      res.locals.defenderCity?.id || res.locals.cityId || req.params.city_id,
    owner_id: res.locals.attackerUserId, // attacker becomes new owner
  };

  const callback = (error, results) => {
    if (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Internal server error in updating city owner" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "City not found" });
    }

    res.locals.updatedCityId = data.city_id;
    res.locals.newOwnerId = data.owner_id;
    next();
  };

  model.updateOwnerById(data, callback);
};
