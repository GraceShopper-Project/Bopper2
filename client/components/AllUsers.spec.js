import {expect} from 'chai'
import React from 'react'
import enzyme, {shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { AllUsers } from './AllUsers'

const adapter = new Adapter()
enzyme.configure({adapter})

describe('AllUsers', () => {
  let allUsers

  beforeEach(() => {
    allUsers = shallow(<AllUsers fetchUsers={() => {}} 
    users={[{ id: 1, name: 'Grace Jones', email: 'grace@gmail.com'}]}/>)
  })

  it('renders the users information', () => {
    expect(allUsers.find('h1').text()).to.be.equal('Grace Jones')
    expect(allUsers.find('h4>p').text()).to.be.equal('grace@gmail.com')
  })
})