const {expect} = require('chai')
const { db, models: { Order, User, Product } } = require('../index')

describe('Order model', () => {
    before(async () => await db.sync({ force: true }))

    describe('Virtual fields', () => {
        let user
        let products

        before(async () => {
            user = await User.create({
                username: 'testuser',
                name: 'test user',
                password: 'whatever',
                email: 'u@example.com',
            })
            
            products = await Product.bulkCreate([
                {
                    name: 'product 1',
                    price: 1000,
                }, {
                    name: 'product 2',
                    price: 2000,
                }, {
                    name: 'product 3',
                    price: 3000,
                }
            ])
        })
    
        describe('itemSubtotal', () => {
            let cart

            before(async () => {
                cart = await user.getCart()
                await cart.setProducts([1,2,3])        
            })

            it('calculates item subtotal for all products in Order', async () => {
                expect(await cart.itemSubtotal).to.equal(6000)
            })
        })
    })
})