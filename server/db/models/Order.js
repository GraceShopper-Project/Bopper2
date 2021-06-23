const Sequelize = require('sequelize')
const db = require('../db')
const OrderItems = require('./OrderItem')
const Product = require('./Product')

const Order = db.define('order', {
    status: {
        type: Sequelize.ENUM('open', 'complete', 'shipped', 'cancelled'),
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

Order.prototype.finalize = async function() {
    try {
        await db.transaction(async (t) => {
            // update salePrice for each item in the order
            await db.query(`update order_items
                set "salePrice" = ( select price from Products where id = order_items."productId" )
                where order_items."orderId" = :orderId`, {
                    replacements: { orderId: this.id },
                    type: Sequelize.QueryTypes.UPDATE
                })

            // update order status
            this.status = 'complete'
            await this.save()
        })
    } catch (err) {
        console.error(`failed to finalize order ${this.id}`)
        throw err
    }
}

module.exports = Order