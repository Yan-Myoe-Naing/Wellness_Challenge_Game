// Change point to city.
module.exports.changePointToCity = (req, res, next) => {
  const user = res.locals.user;
  const requiredPoints = 50;
  if (user.points < requiredPoints) {
    return res.status(403).json({ message: "Not enough points to create a city" });
  }
  const newPoints = user.points - requiredPoints;
  res.locals.newPoints = newPoints;

  next();
};


// Get exchangable army size.
module.exports.getExchangableArmySize = (req, res, next) => {
  const army = res.locals.army;
  const user = res.locals.user;
  const costPerUnit = 15;
  const soldiersPerUnit = 1000;
  const units = Math.floor(user.points / costPerUnit);
  let buyableSize = units * soldiersPerUnit;
  const availableCapacity = army.max_capacity - army.soldiers;
  buyableSize = Math.min(buyableSize, availableCapacity);

  res.locals.buyableSize = buyableSize;
  next();
};


// Change point to soldiers.
module.exports.changePointToSoldiers = (req, res, next) => {
  const army = res.locals.army;
  const user = res.locals.user;
  if (req.body.soldiers == undefined) {
    return res.status(400).json({ message: "Invalid soldier amount requested" });
  }

  let requestedSoldiers = parseInt(req.body.soldiers, 10);
  if (isNaN(requestedSoldiers) || requestedSoldiers <= 0) {
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
    validationMessage = `You requested ${requestedSoldiers}, but only ${soldiersBought} were bought due to limits.`;
  }
  res.locals.newPoints = newPoints;
  res.locals.pointsSpent = pointsSpent;
  res.locals.soldiersBought = soldiersBought;
  res.locals.army = army;
  res.locals.userId = res.locals.user.id;
  res.locals.user = { ...user, points: newPoints };
  res.locals.validationMessage = validationMessage;

  next();
};


// Validate points for completion delete.
module.exports.validatePointsForCompletionDelete = (req, res, next) => {
  const userPoints = Number(res.locals.user.points) || 0;
  const challengePoints = Number(res.locals.challenge.points) || 0;
  if (userPoints < challengePoints) {
    return res.status(409).json({ message: "Not enough points to remove completion" });
  }
  res.locals.newPoints = userPoints - challengePoints;
  next();
};
