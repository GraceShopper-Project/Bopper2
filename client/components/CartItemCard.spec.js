import {expect} from 'chai'
import React from 'react'
import enzyme, {shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Router }from 'react-router-dom'
import CartItem from './CartItemCard'
import history from '../history'


const adapter = new Adapter()
enzyme.configure({adapter})

const product = {
  id: 21,
  name: "Test Speaker",
  price: 4999,
  quantity: 1,
}

describe('Cart Item', () => {
  it('renders basic product information', () => {
    const cartItem = shallow(<CartItem product={product} />)
    expect(cartItem.find('.card .content h5').text()).to.be.equal(product.name, "name")
    expect(cartItem.find('span.price').text()).to.equal("$49.99", "price")
    expect(cartItem.find('span.quantity').text()).to.equal("Quantity: 1", "quantity")
    // because there's no clickable prop, title should render as plain text
    expect(cartItem.find('a').length).to.equal(0, 'title is link')
  })

  it('renders link when clickable=true', () => {
    const cartItem = shallow(<Router history={history}><CartItem product={product} clickable={true} /></Router>)
    expect(/<a href/.test(cartItem.html())).to.be.true
  })

  it.skip('renders an input when setQuantity is given')
})