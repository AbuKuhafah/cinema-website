const { Sequelize, DataTypes } = require("sequelize");
const config = require("./config.js");

const db = {
  Op: Sequelize.Op
};

// Create Sequelize.
db.sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.DIALECT
});

// Include models.
db.user = require("./models/user.js")(db.sequelize, DataTypes);
db.post = require("./models/post.js")(db.sequelize, DataTypes);
db.movie = require("./models/movie.js")(db.sequelize, DataTypes);
db.session = require("./models/session.js")(db.sequelize, DataTypes);
// Relate post, user and movie.
db.post.belongsTo(db.user, { foreignKey: { name: "email", allowNull: false } });
db.post.belongsTo(db.movie, { foreignKey: { name: "title", allowNull: false } });

// Many-to-many relationship between users and sessions;
db.user_session = require("./models/user_session.js")(db, DataTypes);
db.user.belongsToMany(db.session, { through: db.user_session, as: "sessions", foreignKey: "email" });
db.session.belongsToMany(db.user, { through: db.user_session, as: "users", foreignKey: "session_id" });

// Include a sync option with seed data logic included.
db.sync = async () => {
  // Sync schema.
  await db.sequelize.sync();
  
  await seedData();
};

async function seedData() {
  const count = await db.user.count();

  // Only seed data if necessary.
  if(count > 0)
    return;

  // Hash passwords
  const argon2 = require("argon2");

  // Create users
  let hash = await argon2.hash("abc123", { type: argon2.argon2id });
  await db.user.create({ email: "marco@example.com", username: "Marco", password_hash: hash, first_name: "Marco", last_name : "Lai", joined_in: Date('25-09-2023'), locked: false});

  hash = await argon2.hash("abc123", { type: argon2.argon2id });
  await db.user.create({ email: "abu@example.com", username: "Abu", password_hash: hash, first_name: "Abu", last_name : "Kuhafah", joined_in: Date('25-09-2023'), locked: true });

  //create movies
  await db.movie.create({title:"Ironman", rating: 4, description: "Ironman first movie", image_path:"/ironman.jpg"});
  await db.movie.create({title:"Ironman 2", rating: 5, description: "Ironman second movie", image_path:"/ironman2.jpg"});
  await db.movie.create({title:"Ironman 3", rating: 4, description: "Ironman third movie", image_path:"/ironman3.jpg"});
  
  //create sessions
  await db.session.create({session_id: 1, movie_title:"Ironman", session_time:"6:00PM", tickets: 10});
  await db.session.create({session_id: 2, movie_title:"Ironman", session_time:"7:00PM", tickets: 10});
  await db.session.create({session_id: 3, movie_title:"Ironman 2", session_time:"8:00PM", tickets: 10});
  await db.session.create({session_id: 4, movie_title:"Ironman 2", session_time:"9:00PM", tickets: 10});
  await db.session.create({session_id: 5, movie_title:"Ironman 3", session_time:"10:00PM", tickets: 10});
  await db.session.create({session_id: 6, movie_title:"Ironman 3", session_time:"11:00PM", tickets: 10});

}

module.exports = db;
