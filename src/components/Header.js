import { Stack, Typography, Box } from '@mui/material';

function Header() {
  const goat = require('../assets/goat_LAL.png');
  const nba = require('../assets/nba.png');
  return (
    <Stack direction="column" justifyContent="center" alignItems="center" spacing={1}>
      <div style={{ display: "flex", alignItems: "center" }}>
      <a href="/nbastats">
        <img
          src={goat}
          alt=""
          style={{ width: "2.5rem", height: "2.5rem", objectFit: "contain", marginRight: "0.25rem" }}
        />
        </a>
        <Typography variant="h4" fontWeight="bold" fontFamily='Quicksand'>
          GOAT?
        </Typography>
      </div>
      <Box display="flex" alignItems="center">
        <Typography variant="subtitle2" fontFamily='Quicksand'>
            Visualizing the stats of the
        </Typography>
        <img
            src={nba}
            alt=""
            style={{ width: "1.5rem", height: "1.5rem", objectFit: "contain" }}
        />
        <Typography variant="subtitle2" fontFamily='Quicksand'>
            NBA
        </Typography>
        </Box>

    </Stack>
  );
}

export default Header;