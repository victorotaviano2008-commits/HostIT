const db = require('../configs/db.js');

const uploadedGames = db.sequelize.define('uploaded_games', {
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
    genre: {
        type: db.Sequelize.STRING,
        allowNull: true
    },
    gamerCoverURL: {
        type: db.Sequelize.STRING,
        allowNull: true
    },
    developer: {
        type: db.Sequelize.STRING,
        allowNull: true
    },
    userId: {
        type: db.Sequelize.INTEGER,
        allowNull: false
    },
    visibility: {
        type: db.Sequelize.STRING,
        allowNull: true,
        defaultValue: 'Public'
    },
    stars: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    forks: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    isWebGLLaunchable: {
        type: db.Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    version: {
        type: db.Sequelize.STRING,
        allowNull: true
    },
    fileSize: {
        type: db.Sequelize.STRING,
        allowNull: true
    },
    platforms: {
        type: db.Sequelize.TEXT,
        allowNull: true,
        comment: 'JSON array encoded as string'
    },
    tags: {
        type: db.Sequelize.TEXT,
        allowNull: true,
        comment: 'JSON array encoded as string'
    },
    codeOpenSource: {
        type: db.Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    repoVisibility: {
        type: db.Sequelize.STRING,
        allowNull: true,
        defaultValue: 'Public'
    },
    license: {
        type: db.Sequelize.STRING,
        allowNull: true
    },
    repositoryUrl: {
        type: db.Sequelize.STRING,
        allowNull: true
    },
    fileURL: {
        type: db.Sequelize.STRING,
        allowNull: true
    }
});

module.exports = uploadedGames;