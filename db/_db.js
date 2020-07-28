const Sequelize = require('sequelize');
const conf = require('../package.json');

const databaseName =
  conf.name + (process.env.NODE_ENV === 'test' ? '-test' : '');

const db = new Sequelize(
  process.env.DATABASE_URL || `postgres://localhost:5432/${databaseName}`,
  {
    logging: false,
  }
);

module.exports = db;

// Resource Cleanup for Mocha Tests
if (process.env.NODE_ENV === 'test') {
  after('close database connection', () => db.close());
}
