const pool = require("../services/db");


// Select all.
module.exports.selectAll = (callback) => {
  const SQLSTATMENT = `
    SELECT *
    FROM DiplomacyRequest;
  `;

  pool.query(SQLSTATMENT, callback);
};


// Select by id.
module.exports.selectById = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT *
    FROM DiplomacyRequest
    WHERE id = ?
  `;

  const VALUES = [data.request_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};


// Select pending by user id.
module.exports.selectPendingByUserId = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT *
    FROM diplomacyRequest
    WHERE receiver_id = ? AND status = 'pending'
  `;

  const VALUES = [data.user_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};


// Select by user id.
module.exports.selectByUserId = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT *
    FROM diplomacyRequest
    WHERE receiver_id = ? OR sender_id = ?
  `;

  const VALUES = [data.user_id, data.user_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};


// Insert request.
module.exports.insertRequest = (data, callback) => {
  const SQLSTATEMENT = `
    INSERT INTO DiplomacyRequest (
      sender_id,
      receiver_id,
      type,
      status,
      responded_at
    )
    VALUES (?, ?, ?, ?, NULL)
  `;

  const VALUES = [data.sender_id, data.receiver_id, data.type, data.status];

  pool.query(SQLSTATEMENT, VALUES, callback);
};


// Update by id.
module.exports.updateById = (data, callback) => {
  const SQLSTATEMENT = `
    UPDATE DiplomacyRequest
    SET status = ?, responded_at = NOW()
    WHERE id = ?
  `;

  const VALUES = [data.status, data.request_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};


// Delete by id.
module.exports.deleteById = (data, callback) => {
  const SQLSTATEMENT = `
    DELETE
    FROM DiplomacyRequest
    WHERE id = ?
  `;

  const VALUES = [data.request_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};
