import React, { useState } from 'react'
import SearchBar from './SearchBar';
import Cookies from 'js-cookie';


const Exercises = () => {
  const [results, setResults] = useState([]);
  const [add, setAdd] = useState(false);
  const [exerciseName, setExerciseName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');


  const handlePosting = async () => {
    try {
      const token  = Cookies.get('accessToken');
      const response = await fetch('http://localhost:3000/exercise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          exercise: exerciseName,
          muscle_group: muscleGroup,
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        setExerciseName('');
        setMuscleGroup('');
        setResults([]);
        setAdd(false);
      } else {
        console.log(data.message || 'An error occurred while adding the exercise.');
      }
    } catch (error) {
      console.error('Error during posting:', error);
    }
  };


  return (
    <div className='panel'>
      <div className='top'>
        <h1>Exercises</h1>
      </div>
      <div className={add ? 'searchExercises hidden' : 'searchExercises'}>
        <SearchBar setResults={setResults} add={add} />
        <ul className='searchExercisesList'>
          {
            results.length === 0 ? (
              <p>No exercise found</p>
            ) : (
              results.map((result, id) => (
                <li className='noCursor' key={id}>
                  {result.exercise}
                </li>
              )))}
        </ul>
        <button onClick={() => setAdd(true)}>Add new exercise</button>
      </div>
      <div className={add ? 'addExercise' : 'addExercise hidden'}>
        <div className='container'>
          <h2>Add your exercise:</h2>
          <input placeholder='Exercise Name' value={exerciseName} onChange={(e) => {setExerciseName(e.target.value)}} />
          <select
            value={muscleGroup}
            onChange={(e) =>
              setMuscleGroup(e.target.value)
            }
          >
            <option value="" disabled>
              Muscle group
            </option>
            {[
              "BACK",
              "TRICEPS",
              "GLUTE",
              "SHOULDER",
              "BICEP",
              "AB",
              "LEG",
              "CHEST",
            ].map((muscle) => (
              <option key={muscle} value={muscle}>
                {muscle}
              </option>
            ))}
          </select>
          <div className='buttonsFinishWorkout'>
            <button onClick={() => setAdd(!add)}>Back</button>
            <button onClick={() => handlePosting()}>Add</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Exercises
