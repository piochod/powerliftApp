import React from 'react'
import './AboutSection.css'

const AboutSection = () => {
  return (
    <div className='aboutSection'>
      <div className='left'>
        <img src={require("./img/comp.png")} alt="powerlifter"/>
      </div>
      <div className='right'>
        <h1>How does it work?</h1>
        <p>Lorem ipsum</p>
      </div>
    </div>
  )
}

export default AboutSection
