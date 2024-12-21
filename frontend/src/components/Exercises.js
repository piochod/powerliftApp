import React, { useState } from 'react'
import SearchBar from './SearchBar';


const Exercises = () => {
  const [results, setResults] = useState([]);
  const [add, setAdd] = useState(false);
  const [exerciseName, setExerciseName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');


  const handlePosting = async () => {

  }


  return (
    <div class='panel'>
      <div className='top'>
        <h1>Exercises</h1>
      </div>
      <div className={add ? 'searchExercises hidden' : 'searchExercises'}>
        <SearchBar setResults={setResults} />
        <ul className='searchExercisesList'>
          {
            results.length === 0 ? (
              <p>No exercise found</p>
            ) : (
              results.map((result, id) => (
                <li key={id}>
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
            <button onClick={() => handlePosting()}>Finish</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Exercises
