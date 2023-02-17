import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { fetchLineData } from '../../api/api';
import { Chart as ChartJS, registerables } from 'chart.js';
import teams from '../../assets/teams.json';

ChartJS.register(...registerables);
const LineChart = ({ option, stat }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchLineData(option, stat);
      setChartData(data);
    };
    fetchData();
  }, [option, stat]);

  if (!chartData) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ width: '50%' }}>
      <Line
        data={{
          labels: chartData.labels,
          datasets: [
            {
              label: chartData.stat,
              data: chartData.data,
              backgroundColor: `rgb(${teams[option.info.team.id].primary_color})`,
            },
          ],
        }}
        options={{
            plugins: {
                title: {
                    display: true,
                    text: chartData.title
                }
            },
            ticks: {
              precision:0
            },
            scales: {
              y: {
                title: {
                  display: true,
                  text: `${stat}`
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Date'
                }
              }
            }
        }}
      />
    </Box>
  );
};

export default LineChart;
