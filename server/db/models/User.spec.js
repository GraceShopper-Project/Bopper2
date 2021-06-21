/* global describe beforeEach it */

const {expect} = require('chai')
const { db, models: { User } } = require('../index')
const jwt = require('jsonwebtoken');

describe('User model', () => {
  let user;

  before(async () => {
    await db.sync({ force: true })
    user = await User.create({
      username: 'lucy',
      password: 'loo'
    })
  });

  describe('Relations', () => {
    describe('cart', () => {
      it('is created when user is created', async () => {
        expect(user.cartId).to.be.greaterThanOrEqual(0)
        expect((await user.getCart()).id).to.equal(user.cartId)
      })
    })
  })

  describe('instanceMethods', () => {
    describe('generateToken', () => {
      it('returns a token with the id of the user', async () => {
        const token = await user.generateToken();
        const { id } = await jwt.verify(token, process.env.JWT);
        expect(id).to.equal(user.id);
      })
    }) // end describe('correctPassword')
    describe('authenticate', () => {
      describe('with correct credentials', ()=> {
        it('returns a token', async() => {
          const token = await User.authenticate({
            username: 'lucy',
            password: 'loo'
          });
          expect(token).to.be.ok;
        })
      });
      describe('with incorrect credentials', ()=> {
        it('throws a 401', async() => {

          try {
            await User.authenticate({
              username: 'lucy@gmail.com',
              password: '123'
            });
            throw 'nooo';
          }
          catch(ex){
            expect(ex.status).to.equal(401);
          }
        })

      });
    }) // end describe('authenticate')
  }) // end describe('instanceMethods')
}) // end describe('User model')
