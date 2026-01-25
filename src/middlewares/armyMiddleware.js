// Calculate maximum army size based on city population
module.exports.getArmyMaxSize = (req, res, next) => {
  const population = res.locals.population;

  if (population == undefined) {
    return res
      .status(400)
      .json({ message: "Population not set before army capacity calculation" });
  }

  // Formula: 7.2% of population
  const maxCapacity = Math.floor(population * 0.072);

  res.locals.maxCapacity = maxCapacity;

  next();
};

// Generate random army power between 1.5 and 2.5
module.exports.getArmyPower = (req, res, next) => {
  const min = 1.5;
  const max = 2.5;

  const armyPower = Math.random() * (max - min) + min;

  res.locals.armyPower = parseFloat(armyPower.toFixed(2));

  next();
};

// Deduct user points and add soldiers to army
module.exports.changePointToSoldiers = (req, res, next) => {
  const army = res.locals.army;
  const user = res.locals.user;

  // Soldiers requested by user in request body
  const requestedSoldiers = parseInt(req.body.soldiers, 10);

  if (requestedSoldiers == undefined || requestedSoldiers <= 0) {
    return res
      .status(400)
      .json({ message: "Invalid soldier amount requested" });
  }

  // Costing rule: 15 points = 1000 soldiers
  const costPerUnit = 15;
  const soldiersPerUnit = 1000;

  // How many soldiers the user can afford with their points
  const maxUnits = Math.floor(user.points / costPerUnit);
  const maxAffordableSoldiers = maxUnits * soldiersPerUnit;

  // How many soldiers can fit in the army
  const availableCapacity = army.max_capacity - army.soldiers;

  // Final soldiers bought = min(requested, affordable, capacity)
  const soldiersBought = Math.min(
    requestedSoldiers,
    maxAffordableSoldiers,
    availableCapacity,
  );

  // Units actually bought
  const unitsBought = Math.floor(soldiersBought / soldiersPerUnit);

  // Points spent
  const pointsSpent = unitsBought * costPerUnit;

  // Deduct points from user
  const newPoints = user.points - pointsSpent;

  // Add soldiers to army
  army.soldiers += soldiersBought;

  // Validation message if capped
  let validationMessage = null;
  if (soldiersBought < requestedSoldiers) {
    validationMessage = `You requested ${requestedSoldiers}, but only ${soldiersBought} were bought due to limits (points/capacity).`;
  }

  // Pass updated values forward
  res.locals.newPoints = newPoints;
  res.locals.pointsSpent = pointsSpent;
  res.locals.soldiersBought = soldiersBought;
  res.locals.army = army;
  res.locals.user = { ...user, points: newPoints };
  res.locals.validationMessage = validationMessage;

  next();
};


// verify army ownership
module.exports.verifyArmyOwnership = (req, res, next) => {

  if (res.locals.userId != res.locals.city.owner_id) {
    return res
      .status(403)
      .json({ message: "You are not the owner of this army" });
  }

  next();
};

module.exports.verifyArmyOwnershipForBattle = (req, res, next) => {

  if (res.locals.userId != res.locals.attackerCity.owner_id) {
    return res
      .status(403)
      .json({ message: "You are not the owner of this army" });
  }

  next();
};



