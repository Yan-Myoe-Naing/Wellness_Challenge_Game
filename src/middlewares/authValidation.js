// Validate auth input.
module.exports.validateAuthInput = (req, res, next) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ message: "Username or password is missing." });
  }
  if (!/^[A-Za-z0-9]{3,20}$/.test(username)) {
    return res
      .status(400)
      .json({ message: "Username must be 3-20 characters (letters and numbers only)." });
  }
  if (String(password).length < 4) {
    return res.status(400).json({ message: "Password must be at least 4 characters." });
  }
  next();
};


// Verify completion ownership.
module.exports.verifyCompletionOwnership = (req, res, next) => {
  if (res.locals.completion.user_id !== res.locals.userId) {
    return res.status(403).json({ message: "Not your completion" });
  }
  next();
};



