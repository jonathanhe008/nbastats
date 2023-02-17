import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { fetchBarData } from '../../api/api';
import { Chart as ChartJS, registerables } from 'chart.js';
import teams from '../../assets/teams.json';

ChartJS.register(...registerables);
const BarChart = ({ option, stat }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchBarData(option, stat);
      setChartData(data);
    };
    fetchData();
  }, [option, stat]);

  if (!chartData) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ width: '50%' }}>
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
    </Box>
  );
};

export default BarChart;
