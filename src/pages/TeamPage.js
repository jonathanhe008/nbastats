import { useState, useEffect } from 'react';
import React from 'react';
import {
  Grid,
  Container,
  Stack,
  createTheme,
  ThemeProvider,
  CssBaseline
} from '@mui/material';
import { Helmet } from 'react-helmet';
import Headshot from '../components/Headshot';
import ChartCarousel from '../components/charts/ChartCarousel';
import StatTabs from '../components/StatTabs';
import SearchComponent from '../components/Search';
import TeamStatsTable from '../components/tables/TeamStatsTable';
import teams from '../assets/teams.json'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { STAT_LIST } from '../assets/constants';
import { useLocation, useNavigate } from 'react-router-dom';

function TeamPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    if (location.state) {
      setSelectedOption(location.state.selectedOption);
    }
  }, [location.state]);

  const handleSelect = (value) => {
    setSelectedOption(value);
    console.log(value);
    navigate(`/${value.category.toLowerCase()}?name=${value.title}`, { state: { selectedOption: value } });
  };

  
  const [selectedStat, setSelectedStat] = useState('Points');
  
  const handleStatChange = (option) => {
    setSelectedStat(option);
    console.log(option);
  };

  if (location.state === null || selectedOption === null) {
    return <div>Loading...</div>;
  }

  const backgroundColor = `rgba(${teams[selectedOption.apiId].secondary_color}, 0.3)`;

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
      <ThemeProvider theme={theme}>
      <CssBaseline />
      <Grid container spacing={3} sx={{ flexGrow: 1 }} justifyContent="space-between" alignItems="center" marginBottom="1vh" marginTop="1vh">
        <Grid item xs={12} sm={3} textAlign="left">
        </Grid>
        <Grid item xs={12} sm={6}>
          <Header team={teams[selectedOption.apiId].abbrev}></Header>
        </Grid>
        <Grid item xs={12} sm={3} textAlign="right" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <SearchComponent onSelect={handleSelect} width={250}></SearchComponent>
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
      <TeamStatsTable option={selectedOption} onSelect={handleSelect}></TeamStatsTable>
      <Footer></Footer>
      </ThemeProvider>
    </div>
  );
}

export default TeamPage;
