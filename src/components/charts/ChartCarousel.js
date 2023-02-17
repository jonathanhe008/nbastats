import React, { useState } from 'react'
import { Box, Pagination } from '@mui/material';
import LineChart from './LineChart';
import BarChart from './BarChart';
import DoughnutChart from './DoughnutChart';
function ChartCarousel(props) {
    const [activeChart, setActiveChart] = useState(1);
  
    const handleChange = (_, value) => {
        console.log(value)
        setActiveChart(value);
    };
      
    
    return (
        props.selectedOption.category === 'Player' ? 
        <Box display="flex" flexDirection="column" alignItems="center">
            {activeChart === 1 ? <BarChart option={props.selectedOption} stat={props.selectedStat}></BarChart> : 
            <LineChart option={props.selectedOption} stat={props.selectedStat}></LineChart>}
            <Pagination count={2} page={activeChart} onChange={handleChange} />
        </Box> : 
        <Box display="flex" flexDirection="column" alignItems="center">
            <DoughnutChart option={props.selectedOption} stat={props.selectedStat}></DoughnutChart>
        </Box>
    );
    
}

export default ChartCarousel;