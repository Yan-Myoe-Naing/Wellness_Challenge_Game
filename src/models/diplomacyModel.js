const pool = require("../services/db");


// Select all.
module.exports.selectAll = (callback) => {
  const SQLSTATMENT = `
    SELECT *
    FROM Diplomacy;
  `;

  pool.query(SQLSTATMENT, callback);
};


// Select by id.
module.exports.selectById = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT *
    FROM Diplomacy
    WHERE id = ?
  `;

  const VALUES = [data.diplomacy_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};


// Select by user id.
module.exports.selectByUserId = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT *
    FROM Diplomacy
    WHERE initiator_id = ? OR responder_id = ?
  `;

  const VALUES = [data.user_id, data.user_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};


// Select overview.
module.exports.selectOverview = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT *
    FROM Diplomacy;

    SELECT *
    FROM Diplomacy
    WHERE initiator_id = ? OR responder_id = ?;

    SELECT *
    FROM DiplomacyRequest
    WHERE receiver_id = ? AND status = 'pending';

    SELECT *
    FROM DiplomacyRequest
    WHERE sender_id = ? AND status = 'pending';
  `;

  const VALUES = [
    data.user_id,
    data.user_id,
    data.user_id,
    data.user_id,
  ];

  pool.query(SQLSTATEMENT, VALUES, callback);
};


// Insert diplomacy.
module.exports.insertDiplomacy = (data, callback) => {
  const SQLSTATEMENT = `
    INSERT INTO Diplomacy (initiator_id, responder_id, status)
    VALUES (?, ?, ?)
  `;

  const VALUES = [data.initiator_id, data.responder_id, data.status];

  pool.query(SQLSTATEMENT, VALUES, callback);
};


// Delete by id.
module.exports.deleteById = (data, callback) => {
  const SQLSTATEMENT = `
    DELETE
    FROM Diplomacy
    WHERE id = ?
  `;

  const VALUES = [data.diplomacy_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};
