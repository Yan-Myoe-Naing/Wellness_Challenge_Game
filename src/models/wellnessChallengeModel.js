const pool = require("../services/db");

// Insert a new wellness challenge
module.exports.insertSingle = (data, callback) => {
  const SQLSTATMENT = `
    INSERT INTO WellnessChallenge (description, creator_id, points)
    VALUES (?, ?, ?);
    `;
  const VALUES = [data.description, data.creator_id, data.points];
  pool.query(SQLSTATMENT, VALUES, callback);
};

// Get a wellness challenge by its ID
module.exports.selectById = (data, callback) => {
  const SQLSTATEMENT = `
  SELECT *
  FROM WellnessChallenge
  WHERE id = ?
  `;
  const VALUES = [data.challenge_id];
  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Get all wellness challenges
module.exports.selectAll = (callback) => {
  const SQLSTATMENT = `
    SELECT * 
    FROM WellnessChallenge;
    `;
  pool.query(SQLSTATMENT, callback);
};


// Update an existing wellness challenge
module.exports.updateChallenge = (data, callback) => {
  const SQLSTATEMENT = `
  UPDATE  WellnessChallenge
  SET creator_id = ?, description = ?, points = ?   
  WHERE id = ?
  `;
  const VALUES = [
    data.creator_id,
    data.description,
    data.points,
    data.challenge_id,
  ];
  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Insert a user completion record for a challenge
module.exports.insertCompletion = (data, callback) => {
  const SQLSTATMENT = `
    INSERT INTO UserCompletion (challenge_id, user_id, details)
    VALUES (?, ?, ?);
    `;
  const VALUES = [data.challenge_id, data.user_id, data.details];
  pool.query(SQLSTATMENT, VALUES, callback);
};

// Get a user completion record by its ID
module.exports.selectCompletionById = (data, callback) => {
  const SQLSTATEMENT = `
  SELECT *
  FROM UserCompletion
  WHERE id = ?
  `;
  const VALUES = [data.completion_id];
  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Add points to a user by their ID
module.exports.addPointsByUserId = (data, callback) => {
  const SQLSTATEMENT = `
    UPDATE User
    SET points = points + ?
    WHERE id = ?
  `;
  const VALUES = [data.points, data.user_id];
  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Get all completion records for a specific challenge
module.exports.selectByChallengeId = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT *
    FROM UserCompletion
    WHERE challenge_id = ?
  `;
  const VALUES = [data.challenge_id];
  pool.query(SQLSTATEMENT, VALUES, callback);
};

// Get challenge overview (user, all challenges, user completions)
module.exports.selectOverview = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT id, username, points FROM User WHERE id = ?;
    SELECT * FROM WellnessChallenge;
    SELECT * FROM UserCompletion WHERE user_id = ?;
  `;
  const VALUES = [data.user_id, data.user_id];
  pool.query(SQLSTATEMENT, VALUES, callback);
};
