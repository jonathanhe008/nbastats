import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { fetchLineData } from '../../api/api';
import { Chart as ChartJS, registerables } from 'chart.js';
import teams from '../../assets/teams.json';
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(...registerables, annotationPlugin);
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

  const average = (chartData.data.reduce((acc, val) => acc + val, 0) / chartData.data.length).toFixed(1);
  return (
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
          maintainAspectRatio : false,
            plugins: {
                title: {
                    display: true,
                    text: chartData.title
                },
                annotation: {
                  annotations: {
                    line1: {
                      type: 'line',
                      yMin: average,
                      yMax: average,
                      borderColor: `rgba(${teams[option.info.team.id].primary_color}, 0.5)`,
                      borderWidth: 2,
                      borderDash: [5, 5],
                      // label: {
                      //   content: `Average ${chartData.stat}: ${average}`,
                      //   display: true,
                      //   position: 'start',
                      // }
                    }
                  }
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
  );
};

export default LineChart;
