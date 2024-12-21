import React, { useEffect, useState } from 'react';
import './Panel.css';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const Panel = () => {

  
  const [username,setUsername] = useState('');
  const [userId,setUserId] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);



  const fetchUserData = async () =>{
    try{
      const token = Cookies.get('accessToken');
      const response = await fetch('http://localhost:3000/userInfo',{
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      if (response.status === 200){
        const result = await response.json();
        setUsername(result.user.username);
        setUserId(result.user.id);
      }
      else{
        Cookies.remove('accessToken');
        window.location.href = 'http://localhost:3001/login'
      }
      
    } catch(err){
      console.error(err);
    } finally{
      setLoading(false);
    }

  }

  const fetchWorkouts = async (id) =>{
    try{
      const token = Cookies.get('accessToken');
      const response = await fetch(`http://localhost:3000/workouts/${id}`,{
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.status === 200)
      {
        const result = await response.json();
        setWorkouts(result.workouts);
      }
      else{
        console.error('Failed to fetch');
      }
    }
    catch(err){
      console.log(err);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserData();
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchWorkouts(userId);
    }
  }, [userId]); 
  


  return ( 
    <div className='panel'>
      <div className='top'>
        <h1>Welcome!</h1>
      </div>
      <div className='bottom'>
        <div className='container'>
          <ul>
            <h2>Your last workouts:</h2>
            <div className='workouts'>
              {workouts.length===0 ? (<p>No workouts yet start a new workout!</p>): (workouts?.map((data, index) =>{
                return (
                  <Link to={`/workout/${data.id}`}><li key={index}>
                    <p>{data.name}</p><p>{String(data.date).substring(0,10)}</p>
                  </li></Link>
                )
              }))}
            </div>
            <button onClick={() => {window.location.href = 'http://localhost:3001/workout'}}>Start a workout</button>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Panel
