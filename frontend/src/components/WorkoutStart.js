import React, { useState } from 'react'
import './Panel.css'
import './WorkoutStart.css'
import SearchBar from './SearchBar';

const WorkoutStart = () => {
  const [search, setSearch] = useState(true);
  const [results, setResults] = useState([]);
  const [exercises, setExercises] = useState([]);



  const handleAdding = (e) =>{
    setExercises([...exercises,e]);
    setSearch(false);
  }


  return (
    <div className='panel'>
        <div className='top'>
            <h1>Workout</h1>
        </div>
        <div className={search ? 'bottomWorkout hidden' : 'bottomWorkout'}>
          <ul className='searchExercisesList'>
              {exercises?.map((result,id) =>{
                return <li key={id}>
                  {result.exercise} KG<input/> REP<input /> RPE <input /> <button>+</button>
                </li>
              })}
            </ul>
            <button onClick={() => setSearch(!search)}>Add an exercise</button>
        </div>
        <div className={search ? 'searchExercises' : 'searchExercises hidden'}>
          <SearchBar setResults={setResults}/>
          <ul className='searchExercisesList'>
            {results?.map((result,id) =>{
              return <li key={id} onClick={() =>{handleAdding(result)}}>
                {result.exercise}
              </li>
            })}
          </ul>
        </div>
    </div>
  )
}

export default WorkoutStart