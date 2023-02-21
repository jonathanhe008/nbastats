import { Stack, Typography } from '@mui/material';

function Header() {
  const goat = require('../assets/goat_LAL.png');
  return (
    <Stack direction="column" justifyContent="center" alignItems="center" spacing={1}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={goat}
          alt=""
          style={{ width: "2.5rem", height: "2.5rem", objectFit: "contain", marginRight: "0.25rem" }}
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