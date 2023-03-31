import { useState, useEffect } from 'react';
import { Slider, Stack } from '@mui/material';

function YearSlider({ value, defaultYearRange, onChange, color }) {
    const [yearRange, setYearRange] = useState(value);
  
    useEffect(() => {
      setYearRange(defaultYearRange);
    }, [defaultYearRange]);
  
    const handleYearRangeChange = (event, newValue) => {
        setYearRange(newValue);
        onChange(newValue);
    };
  
  return (
    <Stack direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={2}
      sx={{ marginTop: '2rem' }}
    >
      <Slider
        key={yearRange.toString()}
        value={value}
        size="small"
        onChange={handleYearRangeChange}
        min={2015}
        max={2022}
        step={1}
        marks
        valueLabelDisplay="on"
        sx={{ width: 250, color: color }}
      />
    </Stack>
  );
}

export default YearSlider;