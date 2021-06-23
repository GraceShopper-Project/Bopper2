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

      <div id="carouselImages" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="./img/StudioMonitors.jpg" className="d-block w-100" />
          </div>
          <div className="carousel-item">
            <img src="./img/Subwoofer.jpg" className="d-block w-100" />
          </div>
          <div className="carousel-item">
            <img src="./img/BluetoothBeachSpeaker.jpg" className="d-block w-100" />
          </div>
          <div className="carousel-item">
            <img src="./img/BluetoothSpeakerForKids.jpg" className="d-block w-100" />
          </div>
          <div className="carousel-item">
            <img src="./img/CenterChannelSpeaker.jpg" className="d-block w-100" />
          </div>
          <div className="carousel-item">
            <img src="./img/DolbyAtomsCeilingSpeakers.jpg" className="d-block w-100" />
          </div>
          <div className="carousel-item">
            <img src="./img/FancyHeadphones.jpg" className="d-block w-100" />
          </div>
          <div className="carousel-item">
            <img src="./img/SurroundSpeakers.jpg" className="d-block w-100" />
          </div>

            {/* <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button> */}
        </div>
      </div>

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
