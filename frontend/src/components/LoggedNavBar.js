import React, { useEffect, useState } from 'react';
import { fetchUserInfo } from '../utils/fetchUtils';
import './LoggedNavBar.css';
import Cookies from 'js-cookie';

const LoggedNavBar = () => {

  const [username, setUsername] = useState('');

  const destroySession = () => {
    Cookies.remove('accessToken');
    redirect('login');
  }

  const redirect = (location) => {
    window.location.href = `http://localhost:3001/${location}`;
  }

  useEffect(() => {
    const getData = async() =>{
      try{
        const data = await fetchUserInfo();
        setUsername(data.user.username);
      }
      catch(error){
        console.log('Error fetching data', error)
      }
    }
    getData();
  }, [])

  return (
    <nav className='loggedNavBar'>
      <ul>
        <h4>Hi {username}</h4>
        <li onClick={() => { redirect('home') }}>Home</li>
        <li onClick={() => { redirect('workout') }}>Start a workout</li>
        <li onClick={() => { redirect('exercises') }}>Exercices</li>
        <li onClick={() => { redirect('stats') }}>My stats</li>
        <li onClick={destroySession}>Log Out</li>

      </ul>

    </nav>
  )
}

export default LoggedNavBar