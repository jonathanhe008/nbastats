import { Grid, useTheme, useMediaQuery } from '@mui/material';
import PieChart from './PieChart';

function GameCharts(props) {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const { gameId, selectedStat, homeColor, visitorColor } = props;
    return ( isSmallScreen ?
        <Grid container spacing={2} style={{ justifyContent: 'center' }}>
            <Grid item xs={6}>
            <PieChart isHome={true} id={gameId} stat={selectedStat} teamColor={homeColor}></PieChart>
            </Grid>
            <Grid item xs={6}>
            <PieChart isHome={false} id={gameId} stat={selectedStat} teamColor={visitorColor}></PieChart>
            </Grid>
        </Grid> :
        <Grid container spacing={2} style={{ justifyContent: 'center' }}>
        <Grid item xs={2}></Grid>
            <Grid item xs={2}>
            <PieChart isHome={true} id={gameId} stat={selectedStat} teamColor={homeColor}></PieChart>
            </Grid>
            <Grid item xs={2}></Grid>
            <Grid item xs={2}></Grid>
            <Grid item xs={2}>
            <PieChart isHome={false} id={gameId} stat={selectedStat} teamColor={visitorColor}></PieChart>
            </Grid>
            <Grid item xs={2}></Grid>
        </Grid>
    );
}

export default GameCharts;