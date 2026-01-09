const model = require("../models/battleModel");

// Get battle history
module.exports.readBattleHistory = (req, res, next) => {
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error readBattleHistory:", error);
      return res
        .status(500)
        .json({
          message: "Internal server error in getting all battle history",
        });
    } else {
      res.locals.battleHistory = results;
      next();
    }
  };

  model.getHistory(callback);
};

// Get all battles
module.exports.readAllBattle = (req, res, next) => {
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error readAllBattle:", error);
      return res
        .status(500)
        .json({ message: "Internal server error in getting all battles" });
    } else {
      res.locals.allBattles = results;
      next();
    }
  };

  model.selectAll(callback);
};

// Get battle with ID
module.exports.readBattleById = (req, res, next) => {
  const data = {
    battle_id: req.params.battle_id || res.locals.battleId,
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Internal server error in getting battle by ID" });
    } else {
      if (results.length == 0) {
        res.status(404).json({ message: "Battle not found" });
      } else {
        res.locals.battle = results[0];
        next();
      }
    }
  };

  model.selectById(data, callback);
};

// Create new battle record
module.exports.createNewBattle = (req, res, next) => {
  const data = {
    attacker_army_id: res.locals.attackerArmy?.id,
    defender_army_id: res.locals.defenderArmy?.id,
    winner_user_id: res.locals.winnerUserId,
    attacker_requested_reward: res.locals.attackerReward || req.body.action,
  };

  const callback = (error, results) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Internal server error in creating new battle" });
    }

    // store inserted battle id for downstream logic
    res.locals.battleId = results.insertId;
    next();
  };

  model.insertBattle(data, callback);
};
