const Sequelize = require('sequelize')
const db = require('../db')

const Order = db.define('order', {
    status: {
        type: Sequelize.ENUM('open', 'fulfilled', 'shipped', 'cancelled'),
        defaultValue: 'open',
    },
    itemSubtotal: {
        type: Sequelize.VIRTUAL,
        async get() {
            const items = await this.getProducts()
            // item subtotal = product.price * product.order_item.quantity
            return items.reduce((total, p) => total + (p.price * p.order_item.quantity), 0)
        }
    }
})

module.exports = Order