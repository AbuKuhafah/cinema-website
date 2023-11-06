module.exports = (express, app) => {
  const controller = require("../controllers/movie.controller.js");
  const router = express.Router();

  // Select all users.
  router.get("/", controller.all);

  // Select a single user with id.
  router.get("/select/:id", controller.one);

  // Select a single user with title.
  router.get("/select/:title", controller.oneByTitle);

  // Update a post.
  router.put("/", controller.incrementViewCount);

  // Add routes to server.
  app.use("/api/movies", router);
};