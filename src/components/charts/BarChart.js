import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { fetchBarData } from '../../api/api';
import { Chart as ChartJS, registerables } from 'chart.js';
import teams from '../../assets/teams.json';

ChartJS.register(...registerables);
const BarChart = ({ option, stat, yearRange }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchBarData(option, stat, yearRange);
      setChartData(data);
    };
    fetchData();
  }, [option, stat, yearRange]);

  if (!chartData) {
    return <div>Loading...</div>;
  }

  return (
      <Bar
        data={{
          labels: chartData.labels,
          datasets: [
            {
              label: 'Frequency',
              data: chartData.data,
              backgroundColor: `rgb(${teams[option.info.team.id].primary_color})`,
            },
          ],
        }}
        options={{
          maintainAspectRatio : false,
          plugins: {
            title: {
              display: true,
              text: chartData.title,
            },
          },
          ticks: {
            precision: 0,
          },
          scales: {
            y: {
              title: {
                display: true,
                text: 'Frequency',
              },
            },
            x: {
              title: {
                display: true,
                text: stat,
              },
            },
          },
        }}
      />
  );
};

export default BarChart;
