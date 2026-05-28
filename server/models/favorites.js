const db = require('../configs/db.js');

const Favorites = db.sequelize.define('favorites', {
  id: {
    type: db.Sequelize.UUID,
    defaultValue: db.Sequelize.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: db.Sequelize.INTEGER,
    allowNull: false
  },
  gameId: {
    type: db.Sequelize.UUID,
    allowNull: false
  }
});

module.exports = Favorites;
