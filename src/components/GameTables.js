import { Grid } from '@mui/material';
import BoxScoreTable from './tables/BoxScoreTable';

function GameTables(props) {
    const { id, handleSelect } = props;
    return (
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <BoxScoreTable key="home" isHome={true} id={id} onSelect={handleSelect} />
            </Grid>
            <Grid item xs={6}>
                <BoxScoreTable key="visitor" isHome={false} id={id} onSelect={handleSelect} />
            </Grid>
        </Grid>
    );
}

export default GameTables;