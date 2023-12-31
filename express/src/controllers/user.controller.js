const db = require("../database");
const argon2 = require("argon2");

// Select all users from the database.
exports.all = async (req, res) => {
  const users = await db.user.findAll({
  });

  res.json(users);
};

// Select one user from the database.
exports.one = async (req, res) => {
  const user = await db.user.findByPk(req.params.id);

  res.json(user);
};

// Select one user from the database by email.
exports.oneByEmail = async (req, res) => {
  const user = await db.user.findByPk(req.params.email);

  res.json(user);
};

// Select one user from the database if email and password are a match.
exports.login = async (req, res) => {
  const user = await db.user.findByPk(req.query.email);

  if(user === null || await argon2.verify(user.password_hash, req.query.password) === false) {
    // Login failed.
    res.status(401).json({ error: 'Email and/or password invalid, please try again.' });
  } else {
    // Login successful.
    res.json(user);
  }
};

// Create a user in the database.
exports.create = async (req, res) => {
  const hash = await argon2.hash(req.body.password, { type: argon2.argon2id });
  const currentDate = new Date();
  const onlyDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
  const user = await db.user.create({
    email: req.body.email,
    username: req.body.username,
    password_hash: hash,
    first_name: req.body.firstname,
    last_name: req.body.lastname,
    joined_in: onlyDate,
    locked: req.body.locked
  });

  res.json(user);
};

// Update a user in the database.
exports.update = async (req, res) => {
  const user = await db.user.findByPk(req.body.email);
  
  // Update user fields.
  user.username = req.body.username;
  user.first_name = req.body.first_name;
  user.last_name = req.body.last_name;

  await user.save();

  res.json(user);
};

// Delete a user
exports.remove = async (req, res) => {
  let removed = false;

  const user = await db.user.findByPk(req.params.email);
  if(user !== null) {
    await user.destroy();
    removed = true;
  }

  return res.json(removed);
};