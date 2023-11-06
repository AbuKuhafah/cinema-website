const db = require("../database");

// Select all movies from the database.
exports.all = async (req, res) => {
  const movies = await db.movie.findAll(
  );

  res.json(movies);
};

// Select one user from the database.
exports.one = async (req, res) => {
  const movie = await db.movie.findByPk(req.params.id);

  res.json(movie);
};

// Select one movie from the database by title.
exports.oneByTitle = async (req, res) => {
  const movie = await db.movie.findByPk(req.params.title);

  res.json(movie);
};

// Increment the view count of a movie.
exports.incrementViewCount = async (req, res) => {
    const movie = await db.movie.findByPk(req.body.title);
    movie.views = (movie.views || 0) + 1;
    console.log("movieviews: ", movie.views);
    await movie.save();

    res.json(movie);

};