const pool = require("../services/db");


// Select all.
module.exports.selectAll = (callback) => {
  const SQLSTATMENT = `
    SELECT id, owner_id, name
    FROM City;
  `;

  pool.query(SQLSTATMENT, callback);
};


// Select by id.
module.exports.selectById = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT id, owner_id, name, population
    FROM City
    WHERE id = ?
  `;

  const VALUES = [data.city_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};


// Select by user id.
module.exports.selectByUserId = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT *
    FROM City
    WHERE owner_id = ?
  `;

  const VALUES = [data.user_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};


// Insert city.
module.exports.insertCity = (data, callback) => {
  const SQLSTATEMENT = `
    INSERT INTO City (owner_id, name, population)
    VALUES (?, ?, ?)
  `;

  const VALUES = [data.owner_id, data.name, data.population];

  pool.query(SQLSTATEMENT, VALUES, callback);
};


// Delete by id.
module.exports.deleteById = (data, callback) => {
  const SQLSTATMENT = `
    DELETE
    FROM City
    WHERE id = ?
  `;

  const VALUES = [data.city_id];

  pool.query(SQLSTATMENT, VALUES, callback);
};


// Update owner by id.
module.exports.updateOwnerById = (data, callback) => {
  const SQLSTATEMENT = `
    UPDATE City
    SET owner_id = ?
    WHERE id = ?
  `;

  const VALUES = [data.owner_id, data.city_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};


// Select war targets by user id.
module.exports.selectWarTargetsByUserId = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT City.id, City.name, City.owner_id, Army.id AS defender_army_id
    FROM City
    JOIN Army ON Army.city_id = City.id
    JOIN Diplomacy ON (
      (Diplomacy.initiator_id = ? AND Diplomacy.responder_id = City.owner_id)
      OR (Diplomacy.responder_id = ? AND Diplomacy.initiator_id = City.owner_id)
    )
    WHERE Diplomacy.status = 'war'
  `;

  const VALUES = [data.user_id, data.user_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};
