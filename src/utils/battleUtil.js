// Store defender army ID from request body
module.exports.storeDefenderArmyId = (req, res, next) => {
  const defenderArmyId = req.body.defender_army_id;
  if (defenderArmyId == undefined || req.body.action == undefined) {
    return res.status(400).json({
      message: "defender_army_id and action is required in request body",
    });
  }

  res.locals.defenderArmyId = defenderArmyId;
  next();
};

// Validate that attacker and defender are at war before battle
module.exports.validateDiplomacyStatus = (req, res, next) => {
  const diplomacyRecords =
    res.locals.senderDiplomacy ||
    res.locals.receiverDiplomacy ||
    res.locals.diplomacy ||
    [];
  const attackerId = res.locals.attackerUserId;
  const defenderId = res.locals.defenderUserId;

  // Prevent self-battle
  if (attackerId == defenderId) {
    return res.status(409).json({
      message: "Cannot battle your own city",
    });
  }

  // Check if any diplomacy record shows war status between attacker and defender
  const isAtWar = diplomacyRecords.some(
    (d) =>
      ((d.initiator_id === attackerId && d.responder_id === defenderId) ||
        (d.initiator_id === defenderId && d.responder_id === attackerId)) &&
      d.status === "war",
  );

  if (!isAtWar) {
    return res.status(409).json({
      message: "Battle not allowed. Attacker and defender are not at war.",
    });
  }

  res.locals.diplomacyStatus = "war";
  next();
};

// Calculate battle result based on army power and soldiers
module.exports.calculateBattleResult = (req, res, next) => {
  const attackerArmy = res.locals.attackerArmy;
  const defenderArmy = res.locals.defenderArmy;

  if (!attackerArmy || !defenderArmy) {
    return res
      .status(400)
      .json({ message: "Both attacker and defender armies are required" });
  }

  // Compute total power = army_power * soldiers
  const attackerPower =
    Number(attackerArmy.army_power) * Number(attackerArmy.soldiers);
  const defenderPower =
    Number(defenderArmy.army_power) * Number(defenderArmy.soldiers);

  let outcome;
  if (attackerPower > defenderPower) {
    outcome = "attackerWins";
    res.locals.winnerUserId = res.locals.attackerUserId;
  } else if (defenderPower > attackerPower) {
    outcome = "defenderWins";
    res.locals.winnerUserId = res.locals.defenderUserId;
  } else {
    outcome = "defenderWins"; // tie defaults to defender
    res.locals.winnerUserId = res.locals.defenderUserId;
  }

  res.locals.battleResult = outcome;
  res.locals.attackerPower = attackerPower;
  res.locals.defenderPower = defenderPower;

  next();
};

// Add actual reward info to battle history records
module.exports.addActualReward = (req, res, next) => {
  const battles = res.locals.battleHistory || [];

  res.locals.battles = battles.map((row) => {
    const attackerWins = row.winner_user_id === row.attacker_user_id;
    const actualReward = attackerWins ? row.attacker_requested_reward : null;

    return {
      battle_id: row.battle_id,
      attacker_name: row.attacker_name,
      attacker_city: row.attacker_city,
      defender_name: row.defender_name,
      defender_city: row.defender_city,
      winner_name: row.winner_name,
      attacker_requested_reward: row.attacker_requested_reward,
      diplomacy_status: row.diplomacy_status,
      actual_reward: actualReward,
    };
  });

  next();
};
