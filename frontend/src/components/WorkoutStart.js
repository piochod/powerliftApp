import React, { useState, useEffect, useMemo } from 'react';
import './Panel.css';
import './WorkoutStart.css';
import SearchBar from './SearchBar';
import Cookies from 'js-cookie';


const WorkoutStart = () => {
  const savedExercises = useMemo(() => {
    return JSON.parse(localStorage.getItem('workoutExercises')) || [];
  }, []);
  const [search, setSearch] = useState(true);
  const [finish, setFinish] = useState(false);
  const [results, setResults] = useState([]);
  const [exercises, setExercises] = useState(savedExercises);
  const [workoutName, setWorkoutName] = useState("");

  useEffect(() => {
    localStorage.setItem('workoutExercises', JSON.stringify(exercises));
  }, [exercises, savedExercises]);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem('workoutExercises')).length > 0) {
      setSearch(false);
    };
  }, []);

  const handleAddingExercise = (exercise) => {
    setExercises([
      ...exercises,
      { exercise: exercise.exercise, id: exercise.id, sets: [{ kg: '', reps: '', rpe: '5' }] }
    ]);
    setSearch(false);
  };

  const handleAddingSet = (exerciseIndex) => {
    const updatedExercises = [...exercises];
    const lastSet = updatedExercises[exerciseIndex].sets[updatedExercises[exerciseIndex].sets.length - 1];
    const newSet = lastSet
      ? { kg: lastSet.kg, reps: lastSet.reps, rpe: lastSet.rpe }
      : { kg: '', reps: '', rpe: '5' };
    updatedExercises[exerciseIndex].sets.push(newSet);
    setExercises(updatedExercises);
  };

  const handleInputChange = (exerciseIndex, setIndex, field, value) => {
    const updatedExercises = [...exercises];
    if (field === 'rpe' && value === '') {
      updatedExercises[exerciseIndex].sets[setIndex][field] = '5';
    } else {
      updatedExercises[exerciseIndex].sets[setIndex][field] = value;
    }
    setExercises(updatedExercises);
    console.log(exercises);
  };

  const handleDeleteSet = (exerciseIndex, setIndex) => {
    const updatedExercises = [...exercises];
    if (updatedExercises[exerciseIndex].sets.length === 1) {
      updatedExercises.splice(exerciseIndex, 1);
      if (updatedExercises.length === 0) {
        setSearch(true);
      }
    }
    else {
      updatedExercises[exerciseIndex].sets.splice(setIndex, 1);
    }

    setExercises(updatedExercises);
  };

  const handlePosting = async () => {
    const postData = exercises.map((exercise) => ({
      'id': exercise.id,
      'sets': exercise.sets.map((set) => ({
        weight: Number(set.kg) || null,  // Convert to number, default to null if empty or NaN
        reps: Number(set.reps) || null, // Convert to number, default to null if empty or NaN
        rpe: Number(set.rpe) || null,
      })),
    }));
    const workoutData = {
      userId: Number(Cookies.get('userId')),
      workoutName: workoutName,
      exercises: postData
    };

    console.log(JSON.stringify(workoutData));

    const token = Cookies.get('accessToken');

    try {
      const response = await fetch('http://localhost:3000/workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(workoutData, null, 2),
      });
      if (response.status === 201) {
        localStorage.setItem('workoutExercises', JSON.stringify([]));
        window.location.href = 'http://localhost:3001/home';
      };
    }
    catch (err) {
      throw Error;
    }
  }

  const handleChange = (e) => {
    setWorkoutName(e.target.value);
  }

  return (
    <div className='panelWorkout'>
      <div className='top'>
        <h1>Workout</h1>
      </div>
      <div className={!search && !finish ? 'bottomWorkout' : 'bottomWorkout hidden'}>
        <ul className='searchExercisesList'>
          {exercises.map((exercise, exerciseIndex) => (
            <li key={exerciseIndex} className='exercise'>
              <strong>{exercise.exercise}</strong>
              <table>
                <thead>
                  <tr>
                    <th>Set</th>
                    <th>KG</th>
                    <th>REP</th>
                    <th>RPE</th>
                    <th>DEL</th>
                  </tr>
                </thead>
                <tbody>
                  {exercise.sets.map((set, setIndex) => (
                    <tr key={setIndex}>
                      <td>{setIndex + 1}.</td>
                      <td>
                        <input
                          type="number"
                          value={set.kg}
                          onChange={(e) => handleInputChange(exerciseIndex, setIndex, 'kg', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={set.reps}
                          onChange={(e) => handleInputChange(exerciseIndex, setIndex, 'reps', e.target.value)}
                        />
                      </td>
                      <td>
                        <select
                          value={set.rpe}
                          onChange={(e) => handleInputChange(exerciseIndex, setIndex, 'rpe', e.target.value)}
                        >
                          {[...Array(11)].map((_, i) => {
                            const value = i*0.5 + 5; // Values from 5 to 10
                            return <option key={value} value={value}>{value}</option>;
                          })}
                        </select>
                      </td>
                      <td>
                        <button className='delButton' onClick={() => handleDeleteSet(exerciseIndex, setIndex)}>X</button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="5">
                      <button onClick={() => handleAddingSet(exerciseIndex)}>+ Add Set</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </li>
          ))}
        </ul>
        <div className='bottomButtons'>
          <button onClick={() => setSearch(!search)}>Add an exercise</button>
          <button onClick={() => setFinish(!finish)}>Finish workout</button>
        </div>
      </div>
      <div className={search && !finish ? 'searchExercises' : 'searchExercises hidden'}>
        <SearchBar setResults={setResults} />
        <ul className='searchExercisesList'>
          {results.map((result, id) => (
            <li key={id} onClick={() => handleAddingExercise(result)}>
              {result.exercise}
            </li>
          ))}
        </ul>
      </div>
      <div className={finish ? 'finishWorkout' : 'finishWorkout hidden'}>
        <div className='container'>
          <h2>Name your workout:</h2>
          <input placeholder='Unnamed Workout' value={workoutName} onChange={handleChange} />
          <div className='buttonsFinishWorkout'>
            <button onClick={() => setFinish(!finish)}>Back</button>
            <button onClick={() => handlePosting()}>Finish</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WorkoutStart;