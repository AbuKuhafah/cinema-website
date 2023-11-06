module.exports = (sequelize, DataTypes) =>
  sequelize.define("session", {
    session_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    movie_title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    session_time: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tickets: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    // Don't add the timestamp attributes (updatedAt, createdAt).
    timestamps: false
  });
