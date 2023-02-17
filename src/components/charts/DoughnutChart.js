import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { fetchDoughnutData } from '../../api/api';
import { Chart as ChartJS, registerables } from 'chart.js';
import teams from '../../assets/teams.json';

ChartJS.register(...registerables);
const DoughnutChart = ({ option, stat }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchDoughnutData(option, stat);
      setChartData(data);
    };
    fetchData();
  }, [option, stat]);

  if (!chartData) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ width: '50%' }}>
      <Doughnut
        data={{
          labels: chartData.labels,
          datasets: [
            {
              label: `Total ${stat}`,
              data: chartData.data,
              backgroundColor: chartData.data.map((d, i) => `rgba(${teams[option.apiId].primary_color}, ${1 - i * (1/(chartData.data.length))})`),
              hoverOffset: 4
            },
          ],
        }}
        options={{
          plugins: {
            title: {
              display: true,
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
    </Box>
  );
};

export default DoughnutChart;
