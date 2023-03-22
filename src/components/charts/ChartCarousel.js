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
            { props.selectedStat === "Points" ? <>
            <div className="playerChartBox">
                {activeChart === 1 ? <LineChart option={props.selectedOption} stat={props.selectedStat} /> :
                activeChart === 2 ? <BarChart option={props.selectedOption} stat={props.selectedStat} /> :
                activeChart === 3 ? <BubbleChart option={props.selectedOption} stat='FG' /> :
                activeChart === 4 ? <BubbleChart option={props.selectedOption} stat='3PT' /> :
                <BubbleChart option={props.selectedOption} stat='FT' />}
            </div>
            <Stack alignItems="center">
            <Pagination count={5} page={activeChart} onChange={handleChange} />
            </Stack>
            </> : <>
            <div className="playerChartBox">
                {activeChart === 1 ? <LineChart option={props.selectedOption} stat={props.selectedStat}></LineChart> :
                 <BarChart option={props.selectedOption} stat={props.selectedStat}></BarChart>}
            </div>
            <Stack alignItems="center">
            <Pagination count={2} page={activeChart} onChange={handleChange} />
            </Stack>
            </>}
        </Box> : 
        <Box sx={{ width: '50%', height: '50%', margin: '0 auto', '@media screen and (max-width: 767px)': {
            width: '100%', height: '100%'
          } }} display="flex" flexDirection="column" alignItems="center">
            <div className="teamChartBox">
                <DoughnutChart option={props.selectedOption} stat={props.selectedStat} />
            </div>
        </Box>
    );
    
}

export default ChartCarousel;