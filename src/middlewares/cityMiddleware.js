// Generate a random city population between 30,000 and 50,000
module.exports.getPopulation = (req, res, next) => {
  const min = 30000;
  const max = 50000;

  const population = Math.floor(Math.random() * (max - min + 1)) + min;

  res.locals.population = population;

  next();
};
