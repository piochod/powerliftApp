import React, { useEffect } from 'react'
import Cookies from 'js-cookie';
import './SearchBar.css'

const SearchBar = ({setResults}) => {

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
        setResults(await response.json());
    }
    catch(error){
        console.error('error fetching', error);
    }
  }

  useEffect(()=>{
    fetchData();
  },[])

  return (
    <div className='searchBarContainer'>
      <input placeholder='Search an exercise...'></input>
    </div>
  )
}

export default SearchBar
