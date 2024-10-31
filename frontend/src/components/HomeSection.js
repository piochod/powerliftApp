import React from 'react'
import {ReactTyped} from 'react-typed'
import './HomeSection.css'

const HomeSection = () => {
  return (
    <div className='homeSection'>
        <img src={require("./img/powerlifting.png")} alt="powerlifter"/>
        <h1>PowerTracker</h1>
        <h2><ReactTyped 
          strings={["Ready to take your lifting to the next level?","Join us now!"]}
          typeSpeed={70}
          startDelay={1000}
          backDelay={2000}
          backSpeed={60}
          loop
        /></h2>
        <button>Sign Up</button>
    </div>
  )
}

export default HomeSection
