import React from 'react';
import {LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend} from 'recharts';

const ProgressChart = () => {

    const training = [
        {
            date: '20 Dec',
            oneRM: 250,
            volume: 1240
        },
        {
            date: '22 Dec',
            oneRM: 260,
            volume: 1140
        },{
            date: '24 Dec',
            oneRM: 210,
            volume: 1540
        },{
            date: '25 Dec',
            oneRM: 280,
            volume: 940
        },{
            date: '26 Dec',
            oneRM: 290,
            volume: 900
        }
    ];




  return (
    <ResponsiveContainer width={300} height={250}>
        <LineChart width={250} height={250} data={training} >
            <XAxis  stroke='#fff'/>
            <YAxis stroke='#fff'/>
            <Tooltip />
            <Line type="monotone" dataKey='oneRM' stroke='#2563eb'/>
            <Line type="monotone" dataKey='volume' stroke='#7c3aed'/>
        </LineChart>
    </ResponsiveContainer>
  )
}

export default ProgressChart
