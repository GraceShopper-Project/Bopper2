/* global describe beforeEach it */

const {expect} = require('chai')
const request = require('supertest')
const { db, models: { User } } = require('../db')
const seed = require('../../script/seed');
const app = require('../app')

describe('User routes', () => {
  let user;
  
  before(async() => {
    await seed();
    user = await User.findOne({ where: { isAdmin: true }})
    return user
  })

  describe('/api/users/', () => {
    it('GET /api/users', () => {
      const token = user.generateToken();
      return request(app)
        .get('/api/users')
        .set('authorization', token)
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.equal(11);
        })
    })
  }) // end describe('/api/users')
}) // end describe('User routes')
