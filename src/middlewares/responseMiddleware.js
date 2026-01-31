// Format response after creating a city (includes city and army info)
module.exports.formatCreateCityResponse = (req, res, next) => {
  res.locals = {
    message: res.locals.message,
    status: res.locals.status,
    city: res.locals.city,
    army: res.locals.army,
    newPoints: res.locals.newPoints,
  };
  next();
};

// Format response for retrieving buyable army size
module.exports.formatGetBuyableSizeResponse = (req, res, next) => {
  res.locals = {
    message: res.locals.message,
    status: res.locals.status,
    buyableSize: res.locals.buyableSize,
  };
  next();
};

// Format response after buying soldiers (includes points and validation info)
module.exports.formatBuySoldiersResponse = (req, res, next) => {
  res.locals = {
    message: res.locals.message,
    status: res.locals.status,
    army: res.locals.army,
    buyableSize: res.locals.buyableSize,
    newPoints: res.locals.newPoints,
    pointsSpent: res.locals.pointsSpent,
    soldiersBought: res.locals.soldiersBought,
    validationMessage: res.locals.validationMessage,
  };
  next();
};

// Format response for alliance request
module.exports.formatRequestAllianceResponse = (req, res, next) => {
  res.locals = {
    message: res.locals.message,
    status: res.locals.status,
    request: res.locals.request,
  };
  next();
};

// Format response for diplomacy request (optionally includes diplomacy record)
module.exports.formatDiplomacyRequestResponse = (req, res, next) => {
  const { message, status, request, diplomacy } = res.locals;

  const formatted = {
    message,
    status,
    request,
  };

  if (diplomacy) {
    formatted.diplomacy = diplomacy;
  }

  res.locals = formatted;
  next();
};

// Format response after accepting a diplomacy request
module.exports.formatDiplomacyAcceptResponse = (req, res, next) => {
  res.locals = {
    message: res.locals.message,
    status: res.locals.updateStatus,
    request: res.locals.request,
    diplomacy: res.locals.diplomacy,
  };
  next();
};

// Format response for battle results
module.exports.formatBattleResponse = (req, res, next) => {
  res.locals = {
    message: res.locals.message,
    status: res.locals.status,
    battle: res.locals.battle,
    battleResult: res.locals.battleResult,
  };
  next();
};
