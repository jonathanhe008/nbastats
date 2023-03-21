import React, { useState, useEffect } from 'react';
import { Bubble } from 'react-chartjs-2';
import { fetchBubbleData } from '../../api/api';
import { Chart as ChartJS, registerables } from 'chart.js';
import teams from '../../assets/teams.json';

ChartJS.register(...registerables);
const BubbleChart = ({ option, stat }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchBubbleData(option, stat);
      setChartData(data);
    };
    fetchData();
  }, [option, stat]);

  if (!chartData) {
    return <div>Loading...</div>;
  }

  return (
      <Bubble
        data={{
          datasets: [
            {
              label: `${stat}`,
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
            tooltip: {
                callbacks: {
                  label: function(context) {
                    const [year, month, day] = context.dataset.data[context.dataIndex].label.split('-');
                    const { x, y ,r } = context.dataset.data[context.dataIndex];
                    return  `${month}/${day}/${year}: ${r}-${x}; ${y}% ${stat}%`;
                  }
                }
            }
          },
          ticks: {
            precision: 0,
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: `${stat} Percentage`,
              },
            },
            x: {
              title: {
                display: true,
                text: `${stat} Attempts`,
              },
            },
          },
        }}
      />
  );
};

export default BubbleChart;
