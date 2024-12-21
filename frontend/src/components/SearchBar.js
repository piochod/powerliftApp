import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie';
import './SearchBar.css'

const SearchBar = ({setResults}) => {

  const [query,setQuery] = useState('');
  const [exercises, setExercises] = useState([]);

  const fetchData = async () =>{
    try{
        const token = Cookies.get('accessToken')
        const response = await fetch('http://localhost:3000/exercises',{
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        setExercises(await response.json());
    }
    catch(error){
        console.error('error fetching', error);
    }
  };

  useEffect(()=>{
    fetchData();
  },[]);

  useEffect(()=>{
    if (query.length >= 3) {
      const filteredResults = exercises
        .filter(exercise =>
          exercise.exercise.toLowerCase().includes(query.toLowerCase())
        )
        .sort((a, b) => {
          const queryLower = query.toLowerCase();

          if (a.exercise.toLowerCase() === queryLower) return -1;
          if (b.exercise.toLowerCase() === queryLower) return 1;

          if (a.exercise.toLowerCase().startsWith(queryLower) && !b.exercise.toLowerCase().startsWith(queryLower)) return -1;
          if (!a.exercise.toLowerCase().startsWith(queryLower) && b.exercise.toLowerCase().startsWith(queryLower)) return 1;

          return a.exercise.localeCompare(b.exercise);
        });

      setResults(filteredResults);
    } else {
      setResults(exercises);
    }
  },[query,exercises, setResults]);


  return (
    <div className='searchBarContainer'>
      <input 
        placeholder='Search an exercise...'
        value={query}
        onChange={(e)=>setQuery(e.target.value)}></input>
    </div>
  )
}

export default SearchBar
