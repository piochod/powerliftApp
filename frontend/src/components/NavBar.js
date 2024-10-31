import React from 'react'
import "./NavBar.css"

const NavBar = () => {
  return (
      <nav className='navbar'>
        <div className='logo'>
            <img src={require("./img/powerlifting.png")} alt="powerlifter"/>
        </div>
        <ul className='links'>
            <li>Home</li>
            <li>About</li>
            <li>Sign in</li>
            <li>Sign up</li>
        </ul>
      </nav>
  )
}

export default NavBar
