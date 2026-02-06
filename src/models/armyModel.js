const pool = require("../services/db");


// Select all.
module.exports.selectAll = (callback) => {
  const SQLSTATEMENT = `
    SELECT *
    FROM Army;
    `;

  pool.query(SQLSTATEMENT, callback);
};


// Insert army.
module.exports.insertArmy = (data, callback) => {
  const SQLSTATEMENT = `
    INSERT INTO Army (city_id, max_capacity, army_power)
    VALUES (?, ?, ?)
    `;
  const VALUES = [data.city_id, data.max_capacity, data.army_power];

  pool.query(SQLSTATEMENT, VALUES, callback);
};


// Select by id.
module.exports.selectById = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT *
    FROM Army
    WHERE id = ?
    `;
  const VALUES = [data.army_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};


// Select by city ids.
module.exports.selectByCityIds = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT *
    FROM Army
    WHERE city_id IN (?)
    `;
  const VALUES = [data.cityIds];

  pool.query(SQLSTATEMENT, VALUES, callback);
};


// Update soldiers by id.
module.exports.updateSoldiersById = (data, callback) => {
  const SQLSTATEMENT = `
    UPDATE Army
    SET soldiers = ?
    WHERE id = ?
    `;
  const VALUES = [data.soldiers, data.id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};


// Update army power by id.
module.exports.updateArmyPowerById = (data, callback) => {
  const SQLSTATEMENT = `
    UPDATE Army
    SET army_power = ?
    WHERE id = ?
    `;
  const VALUES = [data.power, data.army_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};


// Update army size by id.
module.exports.updateArmySizeById = (data, callback) => {
  const SQLSTATEMENT = `
    UPDATE Army
    SET soldiers = ?
    WHERE id = ?
    `;
  const VALUES = [data.size, data.army_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};


// Delete by id.
module.exports.deleteById = (data, callback) => {
  const SQLSTATEMENT = `
    DELETE FROM Army
    WHERE id = ?
    `;
  const VALUES = [data.army_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};
