const model = require("../models/armyModel.js");

// Get all army
module.exports.readAllArmy = (req, res, next) => {
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error readAllArmy:", error);
      return res
        .status(500)
        .json({ message: "Internal server error in getting all armies" });
    } else {
      res.locals.allArmy = results;
      next();
    }
  };

  model.selectAll(callback);
};

//Get army with ID
module.exports.readArmyById = (role) => (req, res, next) => {
  let armyId;
  if (role === "attacker") {
    armyId = req.params.army_id;
  } else if (role === "defender") {
    armyId = res.locals.defenderArmyId;
  } else {
    armyId = res.locals.armyId;
  }

  const data = {
    army_id: armyId,
  };

  const callback = (error, results) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Internal server error in getting army by ID" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Army not found" });
    }

    const army = results[0];

    if (role === "attacker") {
      res.locals.attackerArmy = army;
    } else if (role === "defender") {
      res.locals.defenderArmy = army;
    } else {
      res.locals.army = army;
    }

    next();
  };

  model.selectById(data, callback);
};

// Get armies by city IDs for a user
module.exports.readArmyByCityId = (req, res, next) => {
  const cities = res.locals.cityByUser; // set by cityController.readCityByUserId

  const data = {
    cityIds: cities.map((city) => city.id),
  };

  const callback = (error, results) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .json({
          message: "Internal server error in getting armies by city IDs",
        });
    } else {
      if (results.length === 0) {
        return res
          .status(404)
          .json({ message: "No armies found for this user" });
      } else {
        res.locals.armies = results;
        next();
      }
    }
  };

  model.selectByCityIds(data, callback);
};

// Create new army for a city
module.exports.createNewArmy = (req, res, next) => {
  const data = {
    city_id: res.locals.cityId,
    max_capacity: res.locals.maxCapacity,
    army_power: res.locals.armyPower,
  };

  const callback = (error, results) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Internal server error in creating army" });
    }

    res.locals.armyId = results.insertId;
    next();
  };

  model.insertArmy(data, callback);
};

// Update army soldiers by ID
module.exports.updateArmyById = (req, res, next) => {
  const armyId = req.params.id || res.locals.army.id;
  const soldiers = res.locals.army.soldiers;

  if (armyId == undefined || soldiers == undefined) {
    return res
      .status(400)
      .json({ message: "Missing army ID or soldiers amount" });
  }

  const data = { id: armyId, soldiers };

  const callback = (error, results) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Internal server error in updating army soldiers" });
    }

    res.locals.army.soldiers = soldiers;

    next();
  };

  model.updateSoldiersById(data, callback);
};

// Update army power for battle
module.exports.updateArmyPower = (req, res, next) => {
  const defenderArmy = res.locals.defenderArmy;

  let currentPower = Number(defenderArmy.army_power) || 0;

  let newPower = currentPower;
  if (currentPower <= 2.8) {
    newPower = Math.min(currentPower + 0.2, 3.0);
  }

  const data = {
    army_id: defenderArmy.id,
    power: newPower,
  };

  const callback = (error, results) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Internal server error in updating army power" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Army not found" });
    }

    res.locals.updatedArmyId = data.army_id;
    res.locals.newArmyPower = data.power;
    next();
  };

  model.updateArmyPowerById(data, callback);
};

// Update army size for battle
module.exports.reduceArmySize = (req, res, next) => {
  const attackerArmy = res.locals.attackerArmy;

  if (attackerArmy == undefined) {
    return res.status(400).json({ message: "Attacker army not found" });
  }

  const newSize = Math.max(0, Math.floor(Number(attackerArmy.soldiers) / 2));

  const data = {
    army_id: attackerArmy.id,
    size: newSize,
  };

  const callback = (error, results) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Internal server error in reducing army size" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Army not found" });
    }

    res.locals.updatedArmyId = data.army_id;
    res.locals.newArmySize = data.size;
    next();
  };

  model.updateArmySizeById(data, callback);
};

// Delete army as battle outcome
module.exports.deleteArmyById = (req, res, next) => {
  const data = {
    army_id: res.locals.defenderArmy?.id,
  };

  const callback = (error, results) => {
    if (error) {
      console.error(error);
    }
    next();
  };

  model.deleteById(data, callback);
};
