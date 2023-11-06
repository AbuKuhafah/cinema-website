const db = require("../database");

// Select all posts from the database.
exports.all = async (req, res) => {
    const session = await db.session.findAll();

    res.json(session);
};

// Select one user from the database.
exports.one = async (req, res) => {
    console.log("req.body.session_id: " + JSON.stringify(req.params.id));
    const session = await db.session.findByPk(req.params.id);

    res.json(session);
};

// Get sessions by movie title
exports.findAllSessionByTitle = async (req, res) => {
    const session = await db.session.findAll({
        where: {
            movie_title: req.params.movie_title
        }
    });

    res.json(session);
};

// Get sessions by email
exports.findAllByEmail = async (req, res) => {
    const user_session = await db.user_session.findAll({
        where: {
            email: req.params.email
        }
    });

    res.json(user_session);
};

// Create a user_session in the database.
exports.create = async (req, res) => {
    const currentDate = new Date();
    const onlyDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    
    const user_session = await db.user_session.create({
        email: req.body.email,
        session_id: req.body.session_id,
        tickets: req.body.tickets,
        booked_in: onlyDate
    });
    res.json(user_session);
};

// Update a session in the database.
exports.update = async (req, res) => {
    const session = await db.session.findByPk(req.body.session_id);

    // Update session fields.
    session.tickets = req.body.tickets;

    await session.save();

    res.json(session);
};