import { Stack, Typography } from '@mui/material';
import goat from '../assets/goat.png';

function Header() {
  return (
    <Stack direction="column" justifyContent="center" alignItems="center" spacing={1}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={goat}
          alt="goat"
          style={{ width: "2rem", height: "2rem", objectFit: "contain", marginRight: "0.5rem" }}
        />
        <Typography variant="h4" fontWeight="bold" fontFamily='Quicksand'>
          GOAT?
        </Typography>
      </div>
      <Typography variant="subtitle2" fontFamily='Quicksand'>
        Visualizing the stats of the NBA
      </Typography>
    </Stack>
  );
}

export default Header;