import React from 'react'
import './Panel.css'
import ProgressChart from './ProgressChart'

const ChartPanel = () => {
  return (
    <div className='panel'>
        <div className='top'>
            <h1>Your Stats</h1>
        </div>
        <div className='bottom'>
            <div className='container'>
                <h2>Squat</h2>
                <ProgressChart />
            </div>
            
        </div>
    </div>
  )
}

export default ChartPanel