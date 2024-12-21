import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

const WorkoutView = ({ id }) => {
  const [workoutName, setWorkoutName] = useState("");
  const [exercises, setExercises] = useState([]);

  const fetchWorkoutData = async () => {
    try {
      const token = Cookies.get("accessToken");
      const response = await fetch(`http://localhost:3000/workout/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        const result = await response.json();
        console.log(result);
        setWorkoutName(result.workout.name);
        setExercises(result.workout.exercises);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchWorkoutData();
  }, []);

  return (
    <div className="panel">
      <h1>{workoutName}</h1>
      <div className="bottom">
        {exercises.map((exercise, exerciseIndex) => (
          <div className="container">
            <ul>
              <li key={exerciseIndex} className="exercise">
                <h2>{exercise.exercise}</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Set</th>
                      <th>KG</th>
                      <th>REP</th>
                      <th>RPE</th>
                      <th>1RM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exercise.sets.map((set, setIndex) => (
                      <tr key={setIndex}>
                        <td>{setIndex + 1}.</td>
                        <td>{set.weight}</td>
                        <td>{set.reps}</td>
                        <td>{set.rpe}</td>
                        <td>{set.orm}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutView;
