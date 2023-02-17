import logo from './assets/logo-gray.png';
import './App.css';
import { useState } from 'react';
import {
  Grid,
  Container,
  Stack,
  Typography,
  createTheme,
  ThemeProvider,
  CssBaseline
} from '@mui/material';
import { Helmet } from 'react-helmet';
import Headshot from './components/Headshot';
import ChartCarousel from './components/charts/ChartCarousel';
import StatTabs from './components/StatTabs';
import SearchComponent from './components/Search';
import TeamStatsTable from './components/tables/TeamStatsTable';
import GameTable from './components/tables/GameTable';
import teams from './assets/teams.json'
import Footer from './components/Footer'
import { STAT_LIST, GOAT } from './assets/constants';

function App() {
  const [selectedOption, setSelectedOption] = useState(GOAT);
  const handleSelect = (value) => {
    setSelectedOption(value);
    console.log(value);
  };
  
  const [selectedStat, setSelectedStat] = useState('Points');
  
  const handleStatChange = (option) => {
    setSelectedStat(option);
    console.log(option);
  };
  
  const backgroundColor = selectedOption.category === "Player" ? `rgba(${teams[selectedOption.info.team.id].secondary_color}, 0.3)` 
  : `rgba(${teams[selectedOption.apiId].secondary_color}, 0.3)`;

  const theme = createTheme({
    typography: {
      fontFamily: 'Quicksand',
    },
  });
  return (
    <div className="App">
      <Helmet>
        <style>{`body { background-color: ${backgroundColor}; }`}</style>
      </Helmet>
      <header>
            <a href="https://jonathanhe008.github.io"><img src={logo} alt="Logo"></img></a>
      </header>
      <ThemeProvider theme={theme}>
      <CssBaseline />
      <Grid container spacing={3} sx={{ flexGrow: 1 }} justifyContent="space-between" alignItems="center" marginBottom="1vh">
        <Grid item xs={12} sm={3} textAlign="left">
        </Grid>
        <Grid item xs={12} sm={6}  textAlign="center">
          <Typography variant="h4" fontWeight="bold" style={{ fontFamily: 'Quicksand' }}>
            Is he Himothy?
          </Typography>
          <Typography variant="subtitle2" style={{ fontFamily: 'Quicksand' }}>
            Visualizing the stats of the NBA
          </Typography>
        </Grid>
        <Grid item xs={12} sm={3} textAlign="right" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <SearchComponent onSelect={handleSelect}></SearchComponent>
        </Grid>
      </Grid>
      <br></br>
      <Stack direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={1}>
      <StatTabs options={STAT_LIST} onChange={handleStatChange} selectedOption={selectedOption}/>
      <br></br>
      <Container maxWidth="sm">
        <Headshot option={selectedOption}></Headshot>
      </Container>
      </Stack>
      <ChartCarousel selectedOption={selectedOption} selectedStat={selectedStat}></ChartCarousel>
      <br></br>
      {selectedOption.category === "Player" ? <GameTable option={selectedOption}></GameTable> : 
      <TeamStatsTable option={selectedOption}></TeamStatsTable>}
      <Footer></Footer>
      </ThemeProvider>
    </div>
  );
}

export default App;
