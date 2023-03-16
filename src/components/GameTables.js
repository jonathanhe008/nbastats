import { Grid } from '@mui/material';
import BoxScoreTable from './tables/BoxScoreTable';

function GameTables(props) {
    const { id, home, visitor, handleSelect } = props;
    return (
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <BoxScoreTable key="home" team={home} id={id} onSelect={handleSelect} />
            </Grid>
            <Grid item xs={6}>
                <BoxScoreTable key="visitor" team={visitor} id={id} onSelect={handleSelect} />
            </Grid>
        </Grid>
    );
}

export default GameTables;