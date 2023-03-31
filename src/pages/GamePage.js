import { useState, useEffect } from 'react';
import React from 'react';
import {
  Grid,
  createTheme,
  ThemeProvider,
  CssBaseline
} from '@mui/material';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router-dom';
import chroma from 'chroma-js';
import SearchComponent from '../components/Search';
import Footer from '../components/Footer'
import Header from '../components/Header'
import StatTabs from '../components/StatTabs';
import GameTables from '../components/GameTables';
import GameHeader from '../components/GameHeader';
import GameCharts from '../components/charts/GameCharts';
import teams from '../assets/teams.json'
import { STAT_LIST } from '../assets/constants';


function GamePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [gameId, setGameId] = useState(null);
  const [gameInfo, setGameInfo] = useState(null);

  useEffect(() => {
    if (location.state) {
        setGameId(location.state.game.id);
        setGameInfo(location.state.game);
    }
  }, [location.state]);

    const handleSelect = (value) => {
        navigate(`/${value.category.toLowerCase()}?name=${value.title}`, { state: { selectedOption: value } });
    };

    const [selectedStat, setSelectedStat] = useState('Points');
  
    const handleStatChange = (option) => {
      setSelectedStat(option);
      console.log(option);
    };

    if (location.state === null || gameId === null) {
        return <div>Loading...</div>;
    }
    const homeTeam = teams[gameInfo.home_team_id];
    const visitorTeam = teams[gameInfo.visitor_team_id];

    const primaryColor = `rgba(${teams[gameInfo.home_team_id].secondary_color}, 0.5)`
    const secondaryColor = `rgba(${teams[gameInfo.visitor_team_id].secondary_color}, 0.5)`
    const midpointColor = chroma.mix(primaryColor, secondaryColor, 0.5, "rgb");

    const gradient = `linear-gradient(135deg, ${primaryColor} 30%, ${midpointColor} 50%, ${secondaryColor} 70%)`;
    const theme = createTheme({
        typography: {
            fontFamily: 'Quicksand',
        }
    });
    
  return (
    <div className="App">
      <Helmet>
        <style>{`body { background: ${gradient}; }`}</style>
      </Helmet>
      <ThemeProvider theme={theme}>
      <CssBaseline />
      <Grid container spacing={3} sx={{ flexGrow: 1 }} justifyContent="space-between" alignItems="center" marginBottom="1vh" marginTop="1vh">
        <Grid item xs={12} sm={3} textAlign="left">
        </Grid>
        <Grid item xs={12} sm={6}>
          <Header team='LAL'></Header>
        </Grid>
        <Grid item xs={12} sm={3} textAlign="right" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <SearchComponent onSelect={handleSelect} width={250}></SearchComponent>
        </Grid>
      </Grid>
      <br></br>
      <StatTabs options={STAT_LIST} onChange={handleStatChange} />
      <br></br>
    <GameHeader homeLogo={homeTeam.logo} visitorLogo={visitorTeam.logo} homeScore={gameInfo.home_team_score} visitorScore={gameInfo.visitor_team_score} gameStatus={gameInfo.status} date={gameInfo.date}></GameHeader>
    <GameCharts gameId={gameId} selectedStat={selectedStat} homeColor={gameInfo.home_team_id} visitorColor={gameInfo.visitor_team_id}></GameCharts>
    <br></br>
      <GameTables id={gameId} handleSelect={handleSelect} />
      <Footer></Footer>
      </ThemeProvider>
    </div>
  );
}

export default GamePage;
