const pool = require("../services/db");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const callback = (error) => {
  if (error) {
    console.error(" Error creating tables:", error);
  } else {
    console.log(" Tables created successfully");
  }
  process.exit();
};

bcrypt.hash("1234", saltRounds, (err, hash) => {
  if (err) {
    console.error(" Error hashing password:", err);
    process.exit();
  }

  const SQLSTATEMENT = `
  DROP TABLE IF EXISTS Diplomacy;
  DROP TABLE IF EXISTS DiplomacyRequest;
  DROP TABLE IF EXISTS Battle;
  DROP TABLE IF EXISTS Army;
  DROP TABLE IF EXISTS City;
  DROP TABLE IF EXISTS UserCompletion;
  DROP TABLE IF EXISTS WellnessChallenge;
  DROP TABLE IF EXISTS User;


  CREATE TABLE User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    points INT DEFAULT 0
  );

  CREATE TABLE WellnessChallenge (
    id INT AUTO_INCREMENT PRIMARY KEY,
    creator_id INT NOT NULL,
    description TEXT NOT NULL,
    points INT NOT NULL
  );

  CREATE TABLE UserCompletion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    challenge_id INT NOT NULL,
    user_id INT NOT NULL,
    details TEXT
  );

  CREATE TABLE City (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    population INT
  );

  CREATE TABLE Army (
    id INT AUTO_INCREMENT PRIMARY KEY,
    city_id INT NOT NULL,
    soldiers INT DEFAULT 0,
    max_capacity INT,
    army_power DECIMAL(5,2)
  );

  CREATE TABLE Battle (
    id INT AUTO_INCREMENT PRIMARY KEY,
    attacker_army_id INT NOT NULL,
    defender_army_id INT NOT NULL,
    winner_user_id INT,
    attacker_requested_reward VARCHAR(50)
  );

  CREATE TABLE Diplomacy (
    id INT AUTO_INCREMENT PRIMARY KEY,
    initiator_id INT NOT NULL,
    responder_id INT NOT NULL,
    status VARCHAR(50) NOT NULL
  );

  CREATE TABLE DiplomacyRequest (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    responded_at DATETIME
  );

  INSERT INTO User (id, username, password_hash, points) VALUES
  (1, 'Reily', '${hash}', 300),
  (2, 'Zune', '${hash}', 50),
  (3, 'George', '${hash}', 110),
  (4, 'Coco', '${hash}', 0),
  (5, 'Bubugaga', '${hash}', 0),
  (6, 'Luna', '${hash}', 15),
  (7, 'Kai', '${hash}', 20 ),
  (8, 'Mira', '${hash}', 8);

  INSERT INTO WellnessChallenge (id, creator_id, description, points) VALUES
  (1, 1, 'Fixing sleep schedule', 20),
  (2, 2, 'Eating Healthy', 20),
  (3, 2, 'Push ups', 15),
  (4, 2, 'Daily Meditation', 20),
  (5, 3, 'Drink 2L of water', 15),
  (6, 1, 'Walk 10,000 steps', 25);

  INSERT INTO UserCompletion (id, challenge_id, user_id, details) VALUES
  (1, 1, 2, 'Slept before 11pm for 5 days'),
  (2, 2, 3, 'Ate vegetables and fruits daily'),
  (3, 3, 4, 'Completed 30 push-ups'),
  (4, 4, 1, 'Meditated 10 minutes every morning'),
  (5, 5, 5, 'Drank 2L water for 3 days'),
  (6, 6, 7, 'Walked 10,000+ steps for a week'),
  (7, 2, 8, 'Switched to whole grains and lean protein'),
  (8, 3, 6, 'Did 20 push-ups each morning');

  INSERT INTO City (id, owner_id, name, population) VALUES
  (1, 1, 'Avalora', 45210),
  (2, 2, 'Zenith', 38950),
  (3, 3, 'Eldoria', 31500),
  (4, 4, 'Solara', 49800),
  (5, 5, 'Drakensport', 36220),
  (6, 6, 'Lumina', 47100),
  (7, 7, 'Valoria', 33670),
  (8, 8, 'Mythralis', 42900);

  INSERT INTO Army (id, city_id, soldiers, max_capacity, army_power) VALUES
  (1, 1, 200, 3255, 2.1),
  (2, 2, 800, 2804, 1.9),
  (3, 3, 300, 2268, 2.3),
  (4, 4, 600, 3586, 2.0),
  (5, 5, 200, 2608, 1.7),
  (6, 6, 400, 3391, 2.4),
  (7, 7, 200, 2424, 1.8),
  (8, 8, 100, 3089, 2.2);

  INSERT INTO Battle (id, attacker_army_id, defender_army_id, winner_user_id, attacker_requested_reward) VALUES
(1, 1, 2, 1, 'capture'),   -- Reily defeats Zune
(2, 3, 4, 4, 'destroy'),    -- Coco defeats George
(3, 6, 5, 6, 'capture'),   -- Luna defeats Bubugaga
(4, 7, 8, 8, 'destroy');    -- Mira defeats Kai

INSERT INTO DiplomacyRequest (id, sender_id, receiver_id, type, status, responded_at) VALUES
(1, 6, 8, 'alliance', 'pending', NULL),
(2, 2, 5, 'alliance', 'accepted', '2025-12-15 10:00:00'),
(3, 4, 7, 'peace', 'accepted', '2025-12-18 14:30:00'),
(7, 1, 2, 'war', 'accepted', NULL),
(8, 4, 3, 'war', 'accepted', NULL),  
(9, 6, 5, 'war', 'accepted', NULL),
(10, 7, 8, 'war', 'accepted', NULL),
(11, 2, 1, 'peace', 'pending', NULL),
(12, 3, 1, 'alliance', 'pending', NULL);

INSERT INTO Diplomacy (id, initiator_id, responder_id, status) VALUES
(1, 2, 5, 'alliance'), -- Zune + Bubugaga alliance
(2, 4, 7, 'peace'),    -- Coco + Kai peace
(3, 1, 2, 'war'),      -- Reily vs Zune war
(4, 4, 3, 'war'),      -- Coco vs George war
(5, 6, 5, 'war'),      -- Luna vs Bubugaga war
(6, 7, 8, 'war');      -- Kai vs Mira war
  `;

  pool.query(SQLSTATEMENT, callback);
});
