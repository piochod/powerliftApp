import React from 'react'
import WorkoutView from '../components/WorkoutView'
import { useParams } from 'react-router-dom';
import LoggedNavBar from '../components/LoggedNavBar';

const WorkoutViewPage = () => {
    const { id } = useParams();
  return (
    <div>
      <LoggedNavBar />
      <WorkoutView id={id}/>
    </div>
  )
}

export default WorkoutViewPage
