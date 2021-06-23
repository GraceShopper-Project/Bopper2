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

Order.prototype.finalize = async () => {
    // const items = await Product.findAll({
    //     include: {
    //         model: OrderItems,
    //         where: {
    //             orderId: this.id
    //         }
    //     }
    // })

    return
    const items = []

    // stamp each item's current price into the salePrice on orderItem
    items.forEach(p => {
        p.order_item.salePrice = p.price
        p.save()
    })

    this.status = 'complete'
    this.save()
}

module.exports = Order