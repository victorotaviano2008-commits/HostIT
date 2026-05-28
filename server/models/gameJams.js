const db = require('../configs/db.js');

const GameJams = db.sequelize.define('game_jams', {
    id: {
        type: db.Sequelize.UUID,
        defaultValue: db.Sequelize.UUIDV4,
        primaryKey: true
    },
    title: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: db.Sequelize.TEXT,
        allowNull: false
    },
    coverURL: {
        type: db.Sequelize.STRING,
        allowNull: true
    },
    organizer: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    startDate: {
        type: db.Sequelize.DATE,
        allowNull: false
    },
    endDate: {
        type: db.Sequelize.DATE,
        allowNull: false
    },
    status: {
        type: db.Sequelize.ENUM('upcoming', 'ongoing', 'finished'),
        allowNull: false,
        defaultValue: 'upcoming'
    },
    theme: {
        type: db.Sequelize.STRING,
        allowNull: true
    },
    participants: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    prize: {
        type: db.Sequelize.TEXT,
        allowNull: true
    },
    rules: {
        type: db.Sequelize.TEXT,
        allowNull: true
    },
    website: {
        type: db.Sequelize.STRING,
        allowNull: true
    },
    tags: {
        type: db.Sequelize.TEXT,
        allowNull: true,
        comment: 'JSON array encoded as string'
    },
    visibility: {
        type: db.Sequelize.STRING,
        allowNull: true,
        defaultValue: 'Public'
    }
}, {
    timestamps: true
});

module.exports = GameJams;
