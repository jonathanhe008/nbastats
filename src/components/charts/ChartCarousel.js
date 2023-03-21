import React, { useState } from 'react'
import { Box, Pagination, Stack } from '@mui/material';
import LineChart from './LineChart';
import BarChart from './BarChart';
import DoughnutChart from './DoughnutChart';
import BubbleChart from './BubbleChart';
function ChartCarousel(props) {
    const [activeChart, setActiveChart] = useState(1);
  
    const handleChange = (_, value) => {
        console.log(value)
        setActiveChart(value);
    };
      
    
    return (
        props.selectedOption.category === 'Player' ? 
        <Box sx={{ width: '50%', height: '50%', margin: '0 auto', '@media screen and (max-width: 767px)': {
            width: '100%', height: '100%'
          } }} display="flex" flexDirection="column" alignItems="center">
            <div className="chartBox">
                {activeChart === 1 ? <LineChart option={props.selectedOption} stat={props.selectedStat}></LineChart> :
                activeChart === 2 ? <BarChart option={props.selectedOption} stat={props.selectedStat}></BarChart> :
                activeChart === 3 ? <BubbleChart option={props.selectedOption} stat='3PT' /> :
                <BubbleChart option={props.selectedOption} stat='FG' />}
            </div>
            <Stack alignItems="center">
            <Pagination count={4} page={activeChart} onChange={handleChange} />
            </Stack>
        </Box> : 
        <Box sx={{ width: '50%', height: '50%', margin: '0 auto', '@media screen and (max-width: 767px)': {
            width: '100%', height: '100%'
          } }} display="flex" flexDirection="column" alignItems="center">
            <DoughnutChart option={props.selectedOption} stat={props.selectedStat}></DoughnutChart>
        </Box>
    );
    
}

export default ChartCarousel;