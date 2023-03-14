import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { fetchPieData } from '../../api/api';
import { Chart as ChartJS, registerables } from 'chart.js';
import teams from '../../assets/teams.json';

ChartJS.register(...registerables);
const PieChart = ({ team, id, stat, teamColor }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchPieData(team, id, stat);
      setChartData(data);
    };
    fetchData();
  }, [team, id, stat]);

  if (!chartData) {
    return <div>Loading...</div>;
  }

  return (
      <Pie
        data={{
          labels: chartData.labels,
          datasets: [
            {
              label: ` ${stat}`,
              data: chartData.data,
              backgroundColor: chartData.data.map((d, i) => `rgba(${teams[teamColor].primary_color}, ${1 - i * (1/(chartData.data.length))})`),
              hoverOffset: 4
            },
          ],
        }}
        options={{
          plugins: {
            title: {
              display: false,
              text: chartData.title,
            },
            legend: {
              display: false
            }
          },
          ticks: {
            precision: 0,
          }
        }}
      />
  );
};

export default PieChart;
