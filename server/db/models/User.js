const Sequelize = require('sequelize')
const db = require('../db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const Order = require('./Order');

const SALT_ROUNDS = 5;

const User = db.define('user', {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: Sequelize.STRING,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    set(pw) {
      this.setDataValue('password', bcrypt.hashSync(pw, SALT_ROUNDS))
    }
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
})

module.exports = User

/**
 * instanceMethods
 */
User.prototype.correctPassword = function(candidatePwd) {
  //we need to compare the plain version to an encrypted version of the password
  return bcrypt.compare(candidatePwd, this.password);
}

User.prototype.generateToken = function() {
  return jwt.sign({id: this.id}, process.env.JWT)
}

/**
 * does whatever is needed to check out
 */
User.prototype.checkout = async function() {
  const order = await this.getCart()
  const items = await order.getProducts()

  if (! items.length) return

  try {
    await order.finalize()
  } catch (err) {
    console.error(`Failed to finalize order ${order.id}`)
    throw err
  }

  try {
    await this.setCart(await Order.create({ userId: this.id }))
  } catch (err) {
    console.error(`Failed to create new cart for user ${this.id}`)
    throw err
  }
}

User.prototype.getDetails = async function() {
  const allOrders = await this.getOrders()
  const cart = await allOrders.filter(o => o.id === this.cartId)[0].getDetails()
  const orders = await Promise.all(allOrders
    .filter(o => o.id !== this.cartId)
    .map(o => o.getDetails())
  )

  return {
    ...this.dataValues,
    cart,
    orders
  }
}

/**
 * classMethods
 */
User.authenticate = async function({ username, password }){
    const user = await this.findOne({where: { username }})
    if (!user || !(await user.correctPassword(password))) {
      const error = Error('Incorrect username/password');
      error.status = 401;
      throw error;
    }
    return user.generateToken();
};

User.findByToken = async function(token) {
  let id;
  try {
    id = (await jwt.verify(token, process.env.JWT)).id
  } catch (ex) {
    const error = new Error('bad token')
    error.status = 401
    throw error
  }
  try {
    const user = User.findByPk(id)
    if (!user) {
      throw 'User Not Found :('
    }
    return user
  } catch (ex) {
    throw ex
  }
}

/**
 * hooks
 */

// assures that every user has a cart
const afterCreate = async (user) => {
  // if user has a cartId, cart already exists and nothing to do
  if (user.cartId) return

  await user.createCart({ userId: user.id })
}

User.afterCreate(afterCreate)
