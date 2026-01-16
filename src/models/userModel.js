const pool = require("../services/db");

// Get all users
module.exports.selectAll = (callback) => {
  const SQLSTATMENT = `
    SELECT * FROM User;
    `;
  pool.query(SQLSTATMENT, callback);
};

// Insert a new user (only username provided)
module.exports.insertSingle = (data, callback) => {
  const SQLSTATEMENT = `
    INSERT INTO \`User\` (username, password_hash)
    VALUES (?, ?);
  `;
  const VALUES = [data.username, data.password_hash];
  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Find a user by username
module.exports.findByUsername = (username, callback) => {
  const SQLSTATMENT = "SELECT * FROM User WHERE username = ?";
  const VALUES = [username];
  pool.query(SQLSTATMENT, VALUES, callback);
};

// Get a user by ID
module.exports.selectById = (data, callback) => {
  const SQLSTATEMENT = `
  SELECT *
  FROM User 
  WHERE id = ?
  `;
  const VALUES = [data.user_id];
  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Update user details (username and points) by ID
module.exports.updateUser = (data, callback) => {
  const SQLSTATEMENT = `
  UPDATE User    
  SET username = ?, points = ?   
  WHERE id = ?
  `;
  const VALUES = [data.username, data.points, data.user_id];
  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Update only points for a user by ID
module.exports.updatePointsById = (data, callback) => {
  const SQLSTATEMENT = `
    UPDATE User
    SET points = ?
    WHERE id = ?
  `;
  const VALUES = [data.points, data.id];
  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Select User by Username
module.exports.selectUserByUsername = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT * FROM User 
        WHERE username = ?
    `;

    const VALUES = [data.username];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

