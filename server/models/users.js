const db = require('../configs/db.js');

const Users = db.sequelize.define('users', {
    id: {
        type: db.Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: db.Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    resetPasswordToken: {
        type: db.Sequelize.STRING,
        allowNull: true
    },
    resetPasswordExpiry: {
        type: db.Sequelize.DATE,
        allowNull: true
    }
});

module.exports = Users;