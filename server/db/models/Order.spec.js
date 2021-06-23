const {expect} = require('chai')
const { db, models: { Order, User, Product } } = require('../index')

describe('Order model', () => {
    let user

    before(async () => {
        await db.sync({ force: true })
        user = await User.create({
            username: 'testuser',
            name: 'test user',
            password: 'whatever',
            email: 'u@example.com',
        })
})

    describe('Virtual fields', () => {
        let products

        before(async () => {            
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

    describe('instance methods', () => {
        describe('finalize', () => {
            let cart

            before(async () => {
                cart = await user.getCart()
                await cart.setProducts([])
            })

            it('does nothing if the order is empty', async () => {
                const cartData = cart.dataValues
                await cart.finalize()
                expect(cart.dataValues).to.deep.equal((await user.getCart()).dataValues, "cart data changed")
            })
            it.skip('finalizes an order containing items', async () => {})
        })
    })
})