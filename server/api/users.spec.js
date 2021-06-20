/* global describe beforeEach it */

const {expect} = require('chai')
const request = require('supertest')
const { db, models: { User, Product } } = require('../db')
const app = require('../app')

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
      const products = await Product.bulkCreate([{
        name: 'product 1',
        price: 1000,
      }, {
        name: 'product 2',
        price: 2000,
      }])
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
}) // end describe('User routes')
