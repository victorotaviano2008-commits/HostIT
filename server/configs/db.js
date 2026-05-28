const path = require('path');
const Sequelize = require('sequelize');
const dotenv = require('dotenv');
const envPath = path.resolve(__dirname, '..', '.env');
dotenv.config({ path: envPath });

const dialect = process.env.DATABASE_DIALECT ? process.env.DATABASE_DIALECT.trim() : 'mysql';
const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect,
});

module.exports = {
    sequelize: sequelize,
    Sequelize: Sequelize
}