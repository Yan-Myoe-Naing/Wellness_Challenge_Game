// Calculate points to deduct when creating a city
module.exports.changePointToCity = (req, res, next) => {
  const user = res.locals.user; // comes from readUserById
  const requiredPoints = 50; // cost to create a city
  // Block if user does not have enough points
  if (user.points < requiredPoints) {
    return res
      .status(403)
      .json({ message: "Not enough points to create a city" });
  }

  // Deduct points logically
  const newPoints = user.points - requiredPoints;

  // Save into locals for next middleware
  res.locals.newPoints = newPoints;

  next();
};

// Calculate how many soldiers can be bought with user's points
module.exports.getExchangableArmySize = (req, res, next) => {
  const army = res.locals.army;
  const user = res.locals.user;

  // Costing rule: 15 points = 1000 soldiers
  const costPerUnit = 15;
  const soldiersPerUnit = 1000;

  // How many full units the user can afford
  const units = Math.floor(user.points / costPerUnit);

  // Convert units to soldiers
  let buyableSize = units * soldiersPerUnit;

  // Cap at army max capacity (considering current soldiers)
  const availableCapacity = army.max_capacity - army.soldiers;
  buyableSize = Math.min(buyableSize, availableCapacity);

  res.locals.buyableSize = buyableSize;
  next();
};

// Calculate points to deduct and add soldiers to army
module.exports.changePointToSoldiers = (req, res, next) => {
  const army = res.locals.army;
  const user = res.locals.user;

  // Soldiers requested by user in request body
  if (req.body.soldiers == undefined) {
    return res
      .status(400)
      .json({ message: "Invalid soldier amount requested" });
  }

  let requestedSoldiers = parseInt(req.body.soldiers, 10);

  // Validate requested soldier amount
  if (isNaN(requestedSoldiers) || requestedSoldiers <= 0) {
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
    validationMessage = `You requested ${requestedSoldiers}, but only ${soldiersBought} were bought due to limits.`;
  }

  // Pass updated values forward
  res.locals.newPoints = newPoints;
  res.locals.pointsSpent = pointsSpent;
  res.locals.soldiersBought = soldiersBought;
  res.locals.army = army;
  res.locals.userId = res.locals.user.id;
  res.locals.user = { ...user, points: newPoints };
  res.locals.validationMessage = validationMessage;

  next();
};
