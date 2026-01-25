const pool = require("../services/db");

// Get all battles
module.exports.selectAll = (callback) => {
  const SQLSTATMENT = `
    SELECT * 
    FROM Battle;
    `;
  pool.query(SQLSTATMENT, callback);
};

// Get a single battle by its ID
module.exports.selectById = (data, callback) => {
  const SQLSTATEMENT = `
  SELECT *
  FROM Battle
  WHERE id = ?
  `;
  const VALUES = [data.battle_id];
  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Insert a new battle record
module.exports.insertBattle = (data, callback) => {
  const SQLSTATEMENT = `
    INSERT INTO Battle (attacker_army_id, defender_army_id, winner_user_id, attacker_requested_reward)
    VALUES (?, ?, ?, ?)
  `;
  const VALUES = [
    data.attacker_army_id,
    data.defender_army_id,
    data.winner_user_id,
    data.attacker_requested_reward,
  ];
  pool.query(SQLSTATEMENT, VALUES, callback);
};
