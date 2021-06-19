const Sequelize = require('sequelize')
const db = require('../db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const axios = require('axios');

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
  // cartId: {
  //   type: Sequelize.INTEGER,
  //   // references: { model: { tableName: 'Order' } },
  // }
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

User.prototype.getCart = async function() {
  // console.log(await this.getOrders())
  const orders = await this.getOrders({
    where: {
      [Sequelize.Op.and]: [
        {userId: this.id},
        {status: 'open'}
      ]
    },
    include: 'products'
  })
  const products = await orders[0].getProducts()
  console.log(products)
  return products.map(p => ({ 
    name: p.name,
    price: p.price,
    salePrice: p.order_item.salePrice,
    quantity: p.order_item.quantity,
    description: p.description,
    imageUrl: p.imageUrl,
  }))
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
const hashPassword = async(user) => {
  //in case the password has been changed, we want to encrypt it with bcrypt
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
  }
}

User.beforeCreate(hashPassword)
User.beforeUpdate(hashPassword)
User.beforeBulkCreate(users => Promise.all(users.map(hashPassword)))
