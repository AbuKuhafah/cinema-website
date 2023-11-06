module.exports = (db, DataTypes) =>
    db.sequelize.define("user_session", {
        email: {
            type: DataTypes.STRING(254),
            primaryKey: true,
            references: {
                model: db.user,
                key: "email"
            }
        },
        session_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: db.session,
                key: "session_id"
            }
        },
        tickets: {
            type: DataTypes.INTEGER,
            allowNull: false
        }, 
        booked_in: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        // Don't add the timestamp attributes (updatedAt, createdAt).
        timestamps: false
    });
