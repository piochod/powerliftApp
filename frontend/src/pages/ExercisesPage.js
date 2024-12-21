import React from 'react'
import Exercises from '../components/Exercises'
import LoggedNavBar from '../components/LoggedNavBar'

const ExercisesPage = () => {
  return (
    <div>
        <LoggedNavBar />
        <Exercises />
    </div>
  )
}

export default ExercisesPage
