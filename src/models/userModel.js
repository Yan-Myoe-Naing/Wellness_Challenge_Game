const pool = require("../services/db");

// Get all users
module.exports.selectAll = (callback) => {
  const SQLSTATMENT = `
    SELECT id,username FROM User;
    `;
  pool.query(SQLSTATMENT, callback);
};

// Insert a new user (only username provided)
module.exports.insertSingle = (data, callback) => {
  const SQLSTATEMENT = `
    INSERT INTO User (username, password_hash)
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

// Get a user by ID
module.exports.selectSelf = (data, callback) => {
  const SQLSTATEMENT = `
  SELECT *
  FROM User 
  WHERE id = ?
  `;
  const VALUES = [data.user_id];
  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Get full profile data (user + cities + armies + diplomacies + pending requests)
module.exports.selectProfile = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT * FROM User WHERE id = ?;
    SELECT * FROM City WHERE owner_id = ?;
    SELECT Army.*
    FROM Army
    JOIN City ON City.id = Army.city_id
    WHERE City.owner_id = ?;
    SELECT * FROM Diplomacy WHERE initiator_id = ? OR responder_id = ?;
    SELECT * FROM DiplomacyRequest WHERE receiver_id = ? AND status = 'pending';
  `;
  const VALUES = [
    data.user_id,
    data.user_id,
    data.user_id,
    data.user_id,
    data.user_id,
    data.user_id,
  ];

  pool.query(SQLSTATEMENT, VALUES, callback);
};


// Update user details (username and points) by ID
module.exports.updateUser = (data, callback) => {
  const SQLSTATEMENT = `
  UPDATE User    
  SET username = ?  
  WHERE id = ?
  `;
  const VALUES = [data.username, data.user_id];
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

// Get users + diplomacies (raw)
module.exports.selectOverview = (callback) => {
  const SQLSTATEMENT = `
    SELECT id, username, points FROM User;
    SELECT * FROM Diplomacy;
  `;
  pool.query(SQLSTATEMENT, callback);
};
