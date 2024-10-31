import React, { useEffect, useState } from 'react';
import './LoggedNavBar.css';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const LoggedNavBar = () => {

  const [username,setUsername] = useState('');
  const navigate = useNavigate();

  const fetchUserInfo = async () =>{
    const token = Cookies.get('accessToken');
    try{
      const response = await fetch( 'http://localhost:3000/userInfo',{
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`
        }});
        if(response.ok){
          const userData = await response.json();
          setUsername(userData.user.username);
        }
      }
      catch(error){
        console.log('Error fetching user info:', error)
      }   
  }

  const destroySession = () =>{
    Cookies.remove('accessToken');
    navigate('/login'); 
  }


  const redirect = (location) =>{
    window.location.href = `http://localhost:3001/${location}`;
  }

  useEffect( () =>{
    fetchUserInfo()
  },[])

  return (
    <nav className='loggedNavBar'>
        <ul>
            <h4>Hi {username}</h4>
            <li onClick={() => {redirect('home')}}>Home</li>
            <li onClick={() => {redirect('workout')}}>Start a workout</li>
            <li>Exercices</li>
            <li onClick={() => {redirect('stats')}}>My stats</li>
            <li onClick={destroySession}>Log Out</li>

        </ul>

    </nav>
  )
}

export default LoggedNavBar