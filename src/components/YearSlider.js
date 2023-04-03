import { useState, useEffect } from 'react';
import { Slider, Stack } from '@mui/material';
import debounce from 'lodash/debounce';

function YearSlider({ value, onChange, color }) {
    const [isDisabled, setIsDisabled] = useState(false);
  
    const handleYearRangeChange = debounce((event, newValue) => {
      setIsDisabled(true);
      onChange(newValue);
    }, 10);
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsDisabled(false);
      }, 1000);
      return () => clearTimeout(timer);
    }, [value]);

    return (
      <Stack direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        sx={{ marginTop: '2rem' }}
      >
        <Slider
          value={value}
          size="small"
          onChangeCommitted={handleYearRangeChange}
          min={2015}
          max={2022}
          marks
          valueLabelDisplay="on"
          sx={{ width: 250, color: color }}
          disabled={isDisabled}
        />
      </Stack>
    );
  }

export default YearSlider;