/* global describe beforeEach it */

const {expect} = require('chai')
const request = require('supertest')
const { db, models: { User } } = require('../db')
const seed = require('../../script/seed');
const app = require('../app')

describe('User routes', () => {
  let user;
  
  beforeEach(async() => {
    await seed();
    user = await User.findOne({ where: { isAdmin: true }})
  })

  describe('/api/users/', () => {
    it('GET /api/users', async () => {
//      const token = user.generateToken();
      const res = await request(app)
      /* return request(app)*/
        .get('/api/users')
//        .set('authorization', token)
        .expect(200)
//        .then((error, res) => {
/         expect(res.body).to.be.an('array');
          expect(res.body.length).to.equal(2);
//        })
    })
  }) // end describe('/api/users')
}) // end describe('User routes')
