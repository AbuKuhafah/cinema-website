module.exports = (express, app) => {
  const controller = require("../controllers/post.controller.js");
  const router = express.Router();

  // Select all posts.
  router.get("/", controller.all);

  // Select all posts by email.
  router.get("/selectBy/:email", controller.findAllByEmail);

  // Select all posts by title.
  router.get("/selectBy/:title", controller.findAllByTitle);

  // Create a new post.
  router.post("/", controller.create);

  //Delete a post
  router.delete("/delete/:post_id", controller.remove);

  // Delete a post by email.
  router.delete("/deleteBy/:email", controller.removeByEmail);

  //Delete all post by user
  router.delete("/delete/:email", controller.deleteAllByEmail);

  // Update a post.
  router.put("/", controller.update);

  // Add routes to server.
  app.use("/api/posts", router);
};
