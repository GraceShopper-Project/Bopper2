//this is the access point for all things database related!

const db = require('./db')

const User = require('./models/User')
const Product = require('./models/Product')
const Order = require('./models/Order')
const OrderItem = require('./models/OrderItem')

//associations could go here!
User.hasMany(Order)
Order.belongsTo(User, { allowNull: false })
// Order.hasOne(User, {
//   as: 'cart',
//   constraints: false,
// })
User.belongsTo(Order, {
  as: 'cart',
  constraints: false,
})

Product.belongsToMany(Order, { through: OrderItem })
Order.belongsToMany(Product, { through: OrderItem })

module.exports = {
  db,
  models: {
    User,
    Product,
    Order,
    OrderItem
  },
}
