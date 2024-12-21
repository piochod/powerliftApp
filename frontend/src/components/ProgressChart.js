import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const ProgressChart = ({ exerciseId }) => {
  const [stats, setStats] = useState([]);

  const fetchExerciseStats = async (exerciseId) => {
    try {
      const token = Cookies.get("accessToken");
      const userId = Cookies.get("userId");
      const response = await fetch(
        `http://localhost:3000/exercise/${exerciseId}/${userId}/workout-stats`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        const result = await response.json();
        const maxVolume = Math.max(...result.map((item) => item.volume));
        const maxOrm = Math.max(...result.map((item) => item.orm));
        const normalizedData = result.map(item => ({
            ...item,
            volumePercentage: maxVolume > 0 ? (item.volume / maxVolume) * 100 : 0, // Normalize volume
            ormPercentage: maxOrm > 0 ? (item.orm / maxOrm) * 100 : 0, // Normalize ORM
          }));

        setStats(normalizedData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setStats([]);
    fetchExerciseStats(exerciseId);
  }, [exerciseId]);

  if (stats.length === 0) {
    return (
      <p>
        No data for this exercise.
      </p>
    );
  }

  return (
    <ResponsiveContainer
      minWidth={700}
      width="100%"
      height={500}
      style={{ padding: "16px" }}
    >
      <LineChart width={500} height={550} data={stats}>
        <XAxis stroke="#fff" tick={false} grid={false} />
        <YAxis
          stroke="#fff"
          grid={false}
          tickFormatter={(value) => `${value}%`}
          domain={[0, 100]}
        />
        <Tooltip
          content={({ payload }) => {
            if (payload && payload.length) {
              const data = payload[0];
              return (
                <div style={{ padding: "10px" }}>
                  <p>Workout: {data.payload.workoutName}</p>
                  <p>1RM: {data.payload.orm} kg (1RM)</p>
                  <p>Volume: {data.payload.volume} kg</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Line type="monotone" dataKey="ormPercentage" stroke="#2563eb" />
        <Line type="monotone" dataKey="volumePercentage" stroke="#7c3aed" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ProgressChart;
