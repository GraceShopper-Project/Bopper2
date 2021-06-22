import {expect} from 'chai'
import React from 'react'
import enzyme, {shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import CartItem from './CartItemCard'

const adapter = new Adapter()
enzyme.configure({adapter})

const product = {
  id: 21,
  name: "Test Speaker",
  price: 4999,
  quantity: 1,
}

describe('Cart Item', () => {
  it('renders the product information', () => {
    const cartItem = shallow(<CartItem product={product} />)
    expect(cartItem.find('h1').text()).to.be.equal('Test Speaker')
    expect(cartItem.find('<p>$').text()).to.be.equal('grace@gmail.com')
  })
})