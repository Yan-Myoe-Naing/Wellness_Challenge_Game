// Format create city response.
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


// Format get buyable size response.
module.exports.formatGetBuyableSizeResponse = (req, res, next) => {
  res.locals = {
    message: res.locals.message,
    status: res.locals.status,
    buyableSize: res.locals.buyableSize,
  };
  next();
};


// Format buy soldiers response.
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


// Format request alliance response.
module.exports.formatRequestAllianceResponse = (req, res, next) => {
  res.locals = {
    message: res.locals.message,
    status: res.locals.status,
    request: res.locals.request,
  };
  next();
};


// Format diplomacy request response.
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


// Format diplomacy accept response.
module.exports.formatDiplomacyAcceptResponse = (req, res, next) => {
  res.locals = {
    message: res.locals.message,
    status: res.locals.updateStatus,
    request: res.locals.request,
    diplomacy: res.locals.diplomacy,
  };
  next();
};


// Format battle response.
module.exports.formatBattleResponse = (req, res, next) => {
  res.locals = {
    message: res.locals.message,
    status: res.locals.status,
    battle: res.locals.battle,
    battleResult: res.locals.battleResult,
  };
  next();
};




