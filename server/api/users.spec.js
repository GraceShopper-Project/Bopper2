/* global describe beforeEach it */

const {expect} = require('chai')
const request = require('supertest')
const { db, models: { User, Product } } = require('../db')
const app = require('../app')
const OrderItems = require('../db/models/OrderItem')

describe('User routes', () => {
  let user;
  let token;

  before(async() => {
    await db.sync({ force: true })
    user = await User.create({
      name: 'test user',
      username: 'testuser',
      email: 'test@user.com',
      password: 'password',
      isAdmin: true
    })
    await Product.bulkCreate([{
      name: 'product 1',
      price: 1000,
    }, {
      name: 'product 2',
      price: 2000,
    }])
    token = user.generateToken();
    return user
  })

  describe('/users', () => {
    it('GET', () => request(app)
      .get('/api/users')
      .set('authorization', token)
      .expect(200)
      .then(res => {
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.equal(1);
      })
    )
  })

  describe('/user/1', () => {
    before(async () => {
      const products = await Product.findAll()
      const cart = await user.getCart()
      await cart.setProducts(products)
    })

    it('GET', () => request(app)
      .get('/api/users/1')
      .set('authorization', token)
      .expect(200)
      .then(async res => {
        expect(res.body).to.be.an('object')
        const userJson = res.body
        expect(userJson.name).to.equal('test user')
        expect(userJson.cart).to.have.length(2)
      })

    )
  }) // end describe('/api/users')

  describe('/user/1/cart', () => {
    before(async () => {
      const cart = await user.getCart()
      await OrderItems.destroy({
        where: {
          orderId: cart.id
        }
      })
    })

    it('POST', () => request(app)
      .post('/api/users/1/cart')
      .set('authorization', token)
      .set('Content-Type', 'application/json')
      .send({
        productId: 1,
        quantity: 1,
      })
      .expect(201)
      .then(async res => {
        const cart = await user.getCart()
        const contents = await cart.getProducts()
        expect(contents).to.be.an('array')
        expect(contents.length).to.equal(1)
      })
    )
    describe('product/:productId', () => {
      it("DELETE", () => request(app)
        .delete('/api/users/1/cart/product/1')
        .set('authorization', token)
        .expect(200)
        .then(async res => {
          const cart = await user.getCart()
          const contents = await cart.getProducts()
          expect(contents).to.be.an('array')
          expect(contents.length).to.equal(0)
        })
    )})
  })
}) // end describe('User routes')
