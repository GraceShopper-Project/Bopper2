const Sequelize = require('sequelize')
const pkg = require('../../package.json')
const debug = require('debug')('app:db:init')

const databaseName = pkg.name + (process.env.NODE_ENV === 'test' ? '-test' : '')

const config = {
  logging: false
};

if(process.env.LOGGING === 'true'){
  delete config.logging
}

//https://stackoverflow.com/questions/61254851/heroku-postgres-sequelize-no-pg-hba-conf-entry-for-host
if(process.env.DATABASE_URL && !process.env.CI){
  config.dialectOptions = {
    ssl: {
      rejectUnauthorized: false
    }
  };
}

const USER = process.env.DB_USER || process.env.USER
const PASS = process.env.DB_PASS || ''

debug('connecting to db')
const db = new Sequelize(
  process.env.DATABASE_URL || `postgres://${USER}:${PASS}@localhost:5432/${databaseName}`, config)
module.exports = db

process.on('exit', () => {
  debug('closing db')
  db.close()
})