const pool = require("../services/db");

// Get all diplomacy requests
module.exports.selectAll = (callback) => {
  const SQLSTATMENT = `
    SELECT * 
    FROM DiplomacyRequest;
    `;
  pool.query(SQLSTATMENT, callback);
};

// Get a diplomacy request by its ID
module.exports.selectById = (data, callback) => {
  const SQLSTATEMENT = `
  SELECT *
  FROM DiplomacyRequest
  WHERE id = ?
  `;
  const VALUES = [data.request_id];
  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Get all pending diplomacy requests for a specific user (as receiver)
module.exports.selectPendingByUserId = (data, callback) => {
  const SQLSTATEMENT = `
  SELECT *
  FROM diplomacyRequest
  WHERE receiver_id = ? AND status = 'pending'
  `;
  const VALUES = [data.user_id];
  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Get all diplomacy requests involving a specific user (as sender or receiver)
module.exports.selectByUserId = (data, callback) => {
  const SQLSTATEMENT = `
  SELECT *
  FROM diplomacyRequest
  WHERE receiver_id = ? OR sender_id = ?
  `;
  const VALUES = [data.user_id, data.user_id];
  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Insert a new diplomacy request
module.exports.insertRequest = (data, callback) => {
  const SQLSTATEMENT = `
    INSERT INTO DiplomacyRequest (sender_id, receiver_id, type, status, responded_at)
    VALUES (?, ?, ?, ?, NULL)
  `;
  const VALUES = [data.sender_id, data.receiver_id, data.type, data.status];
  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Update diplomacy request status by ID (mark as responded)
module.exports.updateById = (data, callback) => {
  const SQLSTATEMENT = `
    UPDATE DiplomacyRequest
    SET status = ?, responded_at = NOW()
    WHERE id = ?
  `;
  const VALUES = [data.status, data.request_id];
  pool.query(SQLSTATEMENT, VALUES, callback);
};
