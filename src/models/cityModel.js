const pool = require("../services/db");

// Get all cities
module.exports.selectAll = (callback) => {
  const SQLSTATMENT = `
    SELECT id, owner_id, name
    FROM City;
    `;
  pool.query(SQLSTATMENT, callback);
};

// Get a city by its ID
module.exports.selectById = (data, callback) => {
  const SQLSTATEMENT = `
  SELECT id, owner_id, name, population
  FROM City
  WHERE id = ?
  `;
  const VALUES = [data.city_id];
  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Get all cities owned by a specific user
module.exports.selectByUserId = (data, callback) => {
  const SQLSTATEMENT = `
  SELECT *
  FROM City
  WHERE owner_id = ?
  `;
  const VALUES = [data.user_id];
  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Insert a new city record
module.exports.insertCity = (data, callback) => {
  const SQLSTATEMENT = `
    INSERT INTO City (owner_id, name, population)
    VALUES (?, ?, ?)
  `;
  const VALUES = [data.owner_id, data.name, data.population];
  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Delete a city by its ID
module.exports.deleteById = (data, callback) => {
  const SQLSTATMENT = `
    DELETE
    FROM City
    WHERE id = ?
  `;
  const VALUES = [data.city_id];
  pool.query(SQLSTATMENT, VALUES, callback);
};

// Update the owner of a city by its ID
module.exports.updateOwnerById = (data, callback) => {
  const SQLSTATEMENT = `
    UPDATE City
    SET owner_id = ?
    WHERE id = ?
  `;
  const VALUES = [data.owner_id, data.city_id];
  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Get war-eligible target cities (includes defender army id)
module.exports.selectWarTargetsByUserId = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT City.id, City.name, City.owner_id, Army.id AS defender_army_id
    FROM City
    JOIN Army ON Army.city_id = City.id
    JOIN Diplomacy
      ON (
        (Diplomacy.initiator_id = ? AND Diplomacy.responder_id = City.owner_id)
        OR (Diplomacy.responder_id = ? AND Diplomacy.initiator_id = City.owner_id)
      )
    WHERE Diplomacy.status = 'war';
  `;
  const VALUES = [data.user_id, data.user_id];
  pool.query(SQLSTATEMENT, VALUES, callback);
};
