import { Slider } from '@mui/material';
import debounce from 'lodash/debounce';

function YearSlider({ isLoading, onChange, color }) {
    const handleYearRangeChange = debounce((event, newValue) => {
      onChange(newValue);
    }, 10);

    return (
        <Slider
          defaultValue={[2022, 2022]}
          size="small"
          onChangeCommitted={handleYearRangeChange}
          min={2003}
          max={2022}
          marks
          valueLabelDisplay="on"
          sx={{ width: 250, color: color }}
          disabled={isLoading}
        />
    );
  }

export default YearSlider;