import React from 'react'
import {connect} from 'react-redux'

/**
 * COMPONENT
 */
export const Home = props => {
  const {name} = props

  return (
    <div className="home-body">
      {
        name ? 
        <h3 id="name">Welcome, {name} to Grace Bopper!</h3> :
        <h3>Welcome to Grace Bopper!</h3>
      }   
      <h3>Your one stop bop shop where all the beats drop</h3>
      <p>We sell a wide variety of speakers and headphones</p>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    name: state.auth.name
  }
}

export default connect(mapState)(Home)
