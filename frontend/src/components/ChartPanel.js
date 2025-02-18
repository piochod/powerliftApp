import React, { useEffect, useState } from 'react'
import SearchBar from './SearchBar';
import './Panel.css'
import ProgressChart from './ProgressChart'
import { fetchExerciseData } from '../utils/fetchUtils';

const ChartPanel = () => {
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState(false);
  const [exerciseId, setExerciseId] = useState(3);
  const [exerciseInfo, setExercisesInfo] = useState([]);

  const handleSwitchingExercise = (exercise) =>{
    setExerciseId(exercise.id);
    setSearch(false);
  };

  useEffect(() =>{
    const getData = async() =>{
      try{
        const data = await fetchExerciseData(exerciseId);
        setExercisesInfo(data);
      }
      catch(err){
        console.error('Error fetching data', err);
      }
    };
    if (exerciseId) getData();
  },[exerciseId]);

  return (
    <div className='panel'>
        <div className='top'>
            <h1>Your Stats</h1>
        </div>
        <div className={search ? 'searchExercises' : 'searchExercises hidden'}>
          <SearchBar setResults={setResults} />
          <ul className='searchExercisesList'>
            {
              results.length===0 ? (
                <p>No exercise found</p>
              ) : (
              results.map((result, id) => (
                <li key={id} onClick={() => handleSwitchingExercise(result)}>
                  {result.exercise}
                </li>
            )))}
          </ul>
        </div>
        <div className={search ? 'bottom hidden': 'bottom'}>
            <div className='chartContainer'>
                <h2>{exerciseInfo.exercise}</h2>
                <ProgressChart exerciseId={exerciseId}/>
                <button onClick={() => setSearch(true)}>Change the exercise</button>
            </div>
        </div>
    </div>
  )
}

export default ChartPanel