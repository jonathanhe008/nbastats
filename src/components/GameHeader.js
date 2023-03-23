import { Grid, useTheme, useMediaQuery, Typography } from '@mui/material';

function GameHeader(props) {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const { homeLogo, visitorLogo, homeScore, visitorScore, gameStatus } = props;
    return (
        <Grid container spacing={2} alignItems="center" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Grid item>
            <img alt="Home Team Logo" src={homeLogo} style={{ marginRight: "0.5rem", marginLeft: "0.5rem", width: isSmallScreen ? "5em" : "10em", height: isSmallScreen ? "5em" : "10em", objectFit: "contain" }} />
            </Grid>
            <Grid item>
                <Grid container direction="column" alignItems="center">
                    <Grid item>
                    <Typography variant={isSmallScreen ? "h5" : "h3"} align="center" color="black">
                    <b>{homeScore} - {visitorScore}</b>
                    </Typography>
                    </Grid>
                    <Grid item>
                    <Typography variant={isSmallScreen ? "subtitle1" : "h5"} align="center" color="black">
                    {gameStatus}
                    </Typography>
                    </Grid>
                </Grid>
                </Grid>
            <Grid item>
            <img alt="Visitor Team Logo" src={visitorLogo} style={{ marginRight: "0.5rem", marginLeft: "0.5rem", width: isSmallScreen ? "5em" : "10em", height: isSmallScreen ? "5em" : "10em", objectFit: "contain" }} />
            </Grid>
    </Grid>
    );
}

export default GameHeader;