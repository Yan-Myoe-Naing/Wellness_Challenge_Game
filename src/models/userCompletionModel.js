const pool = require("../services/db");


// Select by id.
module.exports.selectById = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT *
    FROM UserCompletion
    WHERE id = ?
  `;

  const VALUES = [data.completion_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};


// Delete by id.
module.exports.deleteById = (data, callback) => {
  const SQLSTATEMENT = `
    DELETE
    FROM UserCompletion
    WHERE id = ?
  `;

  const VALUES = [data.completion_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};
