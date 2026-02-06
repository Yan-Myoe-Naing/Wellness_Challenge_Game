const bcrypt = require("bcrypt");

require("dotenv").config();
const pepper = process.env.BCRYPT_PEPPER;
const saltRounds = 10;


// Compare password.
module.exports.comparePassword = (req, res, next) => {
  const callback = (err, isMatch) => {
    if (err) {
      console.error("Error bcrypt:", err);
      res.status(500).json(err);
    } else {
      if (isMatch) {
        next();
      } else {
        res.status(401).json({
          message: "Wrong password",
        });
      }
    }
  };
  bcrypt.compare(req.body.password + pepper, res.locals.hash, callback);
};


// Hash password.
module.exports.hashPassword = (req, res, next) => {
    if (req.body.password == undefined) {
    return res.status(400).json({ message: "Password is undefined" });
  }
  const callback = (err, hash) => {
    if (err) {
      console.error("Error bcrypt:", err);
      res.status(500).json(err);
    } else {
      res.locals.hash = hash;
      next();
    }
  };
  bcrypt.hash(req.body.password + pepper, saltRounds, callback);
};




