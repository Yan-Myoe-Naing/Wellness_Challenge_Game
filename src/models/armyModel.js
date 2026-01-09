const pool = require("../services/db");

// Get all armies
module.exports.selectAll = (callback) => {
  const SQLSTATMENT = `
    SELECT * 
    FROM Army;
    `;
  pool.query(SQLSTATMENT, callback);
};

// Insert a new army record
module.exports.insertArmy = (data, callback) => {
  const SQLSTATEMENT = `
    INSERT INTO Army (city_id, max_capacity, army_power)
    VALUES (?, ?, ?)
  `;
  const VALUES = [data.city_id, data.max_capacity, data.army_power];
  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Get army by its ID
module.exports.selectById = (data, callback) => {
  const SQLSTATEMENT = `
  SELECT *
  FROM Army
  WHERE id = ?
  `;
  const VALUES = [data.army_id];
  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Get armies belonging to multiple city IDs
module.exports.selectByCityIds = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT *
    FROM Army
    WHERE city_id IN (?)
  `;
  const VALUES = [data.cityIds];
  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Update soldiers count by army ID
module.exports.updateSoldiersById = (data, callback) => {
  const SQLSTATEMENT = `
    UPDATE Army 
    SET soldiers = ? 
    WHERE id = ?
  `;
  const VALUES = [data.soldiers, data.id];
  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Update army power by army ID
module.exports.updateArmyPowerById = (data, callback) => {
  const SQLSTATEMENT = `
    UPDATE Army
    SET army_power = ?
    WHERE id = ?
  `;
  const VALUES = [data.power, data.army_id];
  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Update army size (soldiers) by army ID
module.exports.updateArmySizeById = (data, callback) => {
  const SQLSTATEMENT = `
    UPDATE Army
    SET soldiers = ?
    WHERE id = ?
  `;
  const VALUES = [data.size, data.army_id];
  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Delete army by ID
module.exports.deleteById = (data, callback) => {
  const SQLSTATEMENT = `
    DELETE
    FROM Army
    WHERE id = ?
  `;
  const VALUES = [data.army_id];
  pool.query(SQLSTATEMENT, VALUES, callback);
};
