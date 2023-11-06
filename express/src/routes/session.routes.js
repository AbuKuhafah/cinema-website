module.exports = (express, app) => {
    const controller = require("../controllers/session.controller.js");
    const router = express.Router();
    
    // Select all sessions.
    router.get("/", controller.all);

     // Select all sessions by id.
     router.get("/selectUserSession/:id", controller.one);

    // Select all sessions by email.
    router.get("/select/:email", controller.findAllByEmail);

    // Select all sessions by title.
    router.get("/select/:movie_title", controller.findAllSessionByTitle);

    // Create a new post.
    router.post("/", controller.create);

    // Update a post.
    router.put("/", controller.update);

    // Add routes to server.
    app.use("/api/sessions", router);
};
