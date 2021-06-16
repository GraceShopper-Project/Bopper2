const Sequelize = require('sequelize')
const db = require('../db')

const OrderItems = db.define('order_item', {
    quantity: {
        type: Sequelize.INTEGER
      },
    salePrice: {
        type: Sequelize.INTEGER
    }
})

module.exports = OrderItems