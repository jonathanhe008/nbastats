import { useState, useEffect } from 'react';
import React from 'react';
import {
  Grid,
  createTheme,
  ThemeProvider,
  CssBaseline
} from '@mui/material';
import { Helmet } from 'react-helmet';
import SearchComponent from '../components/Search';
import BoxScoreTable from '../components/tables/BoxScoreTable';
import teams from '../assets/teams.json'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { useLocation, useNavigate } from 'react-router-dom';
import { STAT_LIST } from '../assets/constants';
import StatTabs from '../components/StatTabs';
import PieChart from '../components/charts/PieChart';
function GamePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [homeTeamList, setHomeTeamList] = useState(null);
  const [visitorTeamList, setVisitorTeamList] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [gameInfo, setGameInfo] = useState(null);

  useEffect(() => {
    if (location.state) {
        setHomeTeamList(location.state.home);
        setVisitorTeamList(location.state.visitor);
        setGameId(location.state.id);
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

    if (location.state === null || homeTeamList === null || visitorTeamList === null || gameId === null) {
        return <div>Loading...</div>;
    }
    const homeTeam = teams[gameInfo.home_team_id];
    const visitorTeam = teams[gameInfo.visitor_team_id];

    const primaryColor = `rgba(${teams[gameInfo.home_team_id].secondary_color}, 0.3)`
    const secondaryColor = `rgba(${teams[gameInfo.visitor_team_id].secondary_color}, 0.3)`
    const theme = createTheme({
        typography: {
            fontFamily: 'Quicksand',
        }
    });
  
  return (
    <div className="App" >
      <Helmet>
        <style>{`body { background: linear-gradient(135deg, ${primaryColor} 30%, ${secondaryColor} 70%); }`}</style>
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
      <Grid container spacing={2} alignItems="center" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Grid item>
        <img alt="Home Team Logo" src={homeTeam.logo} style={{ marginRight: "0.5rem", marginLeft: "0.5rem", width: "10em", height: "10em", objectFit: "contain" }} />
        </Grid>
        <Grid item>
        <Grid container direction="column" alignItems="center">
            <Grid item>
            <b>{gameInfo.home_team_score} - {gameInfo.visitor_team_score}</b>
            </Grid>
            <Grid item>
            <b>VS</b>
            </Grid>
        </Grid>
        </Grid>
        <Grid item>
        <img alt="Visitor Team Logo" src={visitorTeam.logo} style={{ marginRight: "0.5rem", marginLeft: "0.5rem", width: "10em", height: "10em", objectFit: "contain" }} />
        </Grid>
    </Grid>
    <Grid container spacing={2} style={{ justifyContent: 'center' }}>
    <Grid item xs={2}></Grid>
        <Grid item xs={2}>
        <PieChart team={homeTeamList} id={gameId} stat={selectedStat} teamColor={gameInfo.home_team_id}></PieChart>
        </Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={2}>
        <PieChart team={visitorTeamList} id={gameId} stat={selectedStat} teamColor={gameInfo.visitor_team_id}></PieChart>
        </Grid>
        <Grid item xs={2}></Grid>
    </Grid>
    <br></br>
      <Grid container spacing={2}>
        <Grid item xs={6}>
            <BoxScoreTable key="home" team={homeTeamList} id={gameId} onSelect={handleSelect} />
        </Grid>
        <Grid item xs={6}>
            <BoxScoreTable key="visitor" team={visitorTeamList} id={gameId} onSelect={handleSelect} />
        </Grid>
        </Grid>
      <Footer></Footer>
      </ThemeProvider>
    </div>
  );
}

export default GamePage;
