module.exports = (express, app) => {
  const controller = require("../controllers/user.controller.js");
  const router = express.Router();
  const db = require('../database');

  // Select all users.
  router.get("/", controller.all);

  // Select a single user with id.
  router.get("/select/:id", controller.one);

  // Select a single user with email.
  router.get("/select/:email", controller.oneByEmail);

  // Select one user from the database if username and password are match.
  router.get("/login", controller.login);

  // Check if a user is locked.
  router.get('/isLocked', async (req, res) => {
    try {
      const email = req.query.email;
      const user = await db.user.findOne({
        where: { email }
      });
      if (!user) {
        return res.status(404).send({ isLocked: false }); // User not found, handle as you prefer
      }
      return res.send({ isLocked: user.locked });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).send({ error: 'Server error' });
    }
  });

  // Create a new user.
  router.post("/", controller.create);

  // Update a user.
  router.put("/", controller.update);

  //Delete a user
  router.delete("/delete/:email", controller.remove);

  // Add routes to server.
  app.use("/api/users", router);
};
