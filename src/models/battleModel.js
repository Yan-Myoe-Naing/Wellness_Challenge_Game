const pool = require("../services/db");

// Get all battles
module.exports.selectAll = (callback) => {
  const SQLSTATMENT = `
    SELECT * 
    FROM Battle;
    `;
  pool.query(SQLSTATMENT, callback);
};

// Get full battle history with attacker/defender/winner details and diplomacy status
module.exports.getHistory = (callback) => {
  const SQLSTATMENT = `
SELECT 
  Battle.id AS battle_id,
  AttackerUser.username AS attacker_name,
  AttackerCity.name AS attacker_city,
  DefenderUser.username AS defender_name,
  DefenderCity.name AS defender_city,
  WinnerUser.username AS winner_name,
  Battle.attacker_requested_reward,
  Diplomacy.status AS current_diplomacy_status
FROM Battle
JOIN Army AS AttackerArmy 
  ON Battle.attacker_army_id = AttackerArmy.id
JOIN City AS AttackerCity 
  ON AttackerArmy.city_id = AttackerCity.id
JOIN User AS AttackerUser 
  ON AttackerCity.owner_id = AttackerUser.id
JOIN Army AS DefenderArmy 
  ON Battle.defender_army_id = DefenderArmy.id
JOIN City AS DefenderCity 
  ON DefenderArmy.city_id = DefenderCity.id
JOIN User AS DefenderUser 
  ON DefenderCity.owner_id = DefenderUser.id
LEFT JOIN User AS WinnerUser 
  ON Battle.winner_user_id = WinnerUser.id
LEFT JOIN Diplomacy 
  ON ( (Diplomacy.initiator_id = AttackerUser.id AND Diplomacy.responder_id = DefenderUser.id) 
    OR (Diplomacy.initiator_id = DefenderUser.id AND Diplomacy.responder_id = AttackerUser.id) );
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
