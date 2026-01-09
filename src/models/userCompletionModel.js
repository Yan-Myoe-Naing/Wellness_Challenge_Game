const pool = require("../services/db");

// Get all user completion records
module.exports.selectAll = (callback) => {
  const SQLSTATMENT = `
    SELECT * 
    FROM UserCompletion;
    `;
  pool.query(SQLSTATMENT, callback);
};

// Get a user completion record by its ID
module.exports.selectById = (data, callback) => {
  const SQLSTATEMENT = `
  SELECT *
  FROM UserCompletion
  WHERE id = ?
  `;
  const VALUES = [data.completion_id];
  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Get all completion records for a specific user
module.exports.selectByUserId = (data, callback) => {
  const SQLSTATEMENT = `
  SELECT *
  FROM UserCompletion
  WHERE user_id = ?
  `;
  const VALUES = [data.user_id];
  pool.query(SQLSTATEMENT, VALUES, callback);
};
