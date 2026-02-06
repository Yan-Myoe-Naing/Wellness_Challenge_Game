// Get army max size.
module.exports.getArmyMaxSize = (req, res, next) => {
  const population = res.locals.population;

  if (population == undefined) {
    return res.status(400).json({ message: "Population not set before army capacity calculation" });
  }
  const maxCapacity = Math.floor(population * 0.072);

  res.locals.maxCapacity = maxCapacity;

  next();
};


// Get army power.
module.exports.getArmyPower = (req, res, next) => {
  const min = 1.5;
  const max = 2.5;

  const armyPower = Math.random() * (max - min) + min;

  res.locals.armyPower = parseFloat(armyPower.toFixed(2));

  next();
};


// Change point to soldiers.
module.exports.changePointToSoldiers = (req, res, next) => {
  const army = res.locals.army;
  const user = res.locals.user;
  const requestedSoldiers = parseInt(req.body.soldiers, 10);

  if (requestedSoldiers == undefined || requestedSoldiers <= 0) {
    return res.status(400).json({ message: "Invalid soldier amount requested" });
  }
  const costPerUnit = 15;
  const soldiersPerUnit = 1000;
  const maxUnits = Math.floor(user.points / costPerUnit);
  const maxAffordableSoldiers = maxUnits * soldiersPerUnit;
  const availableCapacity = army.max_capacity - army.soldiers;
  const soldiersBought = Math.min(
    requestedSoldiers,
    maxAffordableSoldiers,
    availableCapacity,
  );
  const unitsBought = Math.floor(soldiersBought / soldiersPerUnit);
  const pointsSpent = unitsBought * costPerUnit;
  const newPoints = user.points - pointsSpent;
  army.soldiers += soldiersBought;
  let validationMessage = null;
  if (soldiersBought < requestedSoldiers) {
    validationMessage = `You requested ${requestedSoldiers}, but only ${soldiersBought} were bought due to limits (points/capacity).`;
  }
  res.locals.newPoints = newPoints;
  res.locals.pointsSpent = pointsSpent;
  res.locals.soldiersBought = soldiersBought;
  res.locals.army = army;
  res.locals.user = { ...user, points: newPoints };
  res.locals.validationMessage = validationMessage;

  next();
};


// Verify army ownership.
module.exports.verifyArmyOwnership = (req, res, next) => {

  if (res.locals.userId != res.locals.city.owner_id) {
    return res.status(403).json({ message: "You are not the owner of this army" });
  }

  next();
};


// Verify army ownership for battle.
module.exports.verifyArmyOwnershipForBattle = (req, res, next) => {

  if (res.locals.userId != res.locals.attackerCity.owner_id) {
    return res.status(403).json({ message: "You are not the owner of this army" });
  }

  next();
};








