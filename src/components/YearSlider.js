import { Slider, Stack } from '@mui/material';
import debounce from 'lodash/debounce';

function YearSlider({ isLoading, onChange, color }) {
    const handleYearRangeChange = debounce((event, newValue) => {
      onChange(newValue);
    }, 10);

    return (
      <Stack direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        sx={{ marginTop: '2rem' }}
      >
        <Slider
          defaultValue={[2022, 2022]}
          size="small"
          onChangeCommitted={handleYearRangeChange}
          min={2015}
          max={2022}
          marks
          valueLabelDisplay="on"
          sx={{ width: 250, color: color }}
          disabled={isLoading}
        />
      </Stack>
    );
  }

export default YearSlider;