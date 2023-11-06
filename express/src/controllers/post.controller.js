const db = require("../database");

// Select all posts from the database.
exports.all = async (req, res) => {
  const posts = await db.post.findAll();

  res.json(posts);
};

// Get reviews by email
exports.findAllByEmail = async (req, res) => {
  const post = await db.post.findAll({
    where: {
      email: req.params.email
    }
  });

  res.json(post);
};

// Get reviews by movie title
exports.findAllByTitle = async (req, res) => {
  const post = await db.post.findAll({
    where: {
      title: req.params.title
    }
  });

  res.json(post);
};


// Create a post in the database.
exports.create = async (req, res) => {
  try {
    // Extract necessary data from request body
    const { review, rating, email, title } = req.body;
    
    // Check if user is locked
    const foundUser = await db.user.findOne({ where: { email } });
    if (!foundUser) {
      return res.status(404).send({ message: "User not found" });
    }
    if (foundUser.locked) {
      return res.status(403).send({ message: "User is locked and cannot post reviews" });
    }

    // Proceed with creating the post
    const post = await db.post.create({ review, rating, email, title });
    res.status(201).send(post);
  } catch (error) {
    res.status(500).send({ message: "Error creating post", error: error.message });
  }
};

// Delete a post
exports.remove = async (req, res) => {
  let removed = false;

  const post = await db.post.findByPk(req.params.post_id);
  if(post !== null) {
    await post.destroy();
    removed = true;
  }

  return res.json(removed);
};

// Delete a post
exports.removeByEmail = async (req, res) => {
  let removed = false;

  const post = await db.post.findOne({
    where: { email: req.body.email}
  });
  if(post !== null) {
    await post.destroy();
    removed = true;
  }

  return res.json(removed);
};

// Delete all reviews by email
exports.deleteAllByEmail = async (req, res) => {
  let removed = false;
  if(removed === false) {
    await post.destroyAll({
      where: {
        email: req.params.email
      }
    });
    removed = true;
  }

  return res.json(removed);

};

// Update a post in the database.
exports.update = async (req, res) => {
  const post = await db.post.findOne({
    where: { email: req.body.email}
  });

  // Update post fields.
  post.email = req.body.email;
  post.rating = req.body.rating;
  post.review = req.body.review;
  post.title = req.body.title;

  await post.save();

  res.json(post);
};
