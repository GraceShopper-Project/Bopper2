const Sequelize = require('sequelize')
const db = require('../db')

const Order = db.define('order', {
    status: {
        type: Sequelize.ENUM('open', 'fulfilled', 'shipped', 'cancelled')
    }
})

module.exports = Order