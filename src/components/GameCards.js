import React, { useState, useEffect }  from 'react';
import { Card, CardContent, CardMedia, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { fetchTrendingGames } from '../api/api';
import { Link } from 'react-router-dom';
import teams from '../assets/teams.json'

function GameCard(props) {
  const { game } = props;
  const { home_team_score, visitor_team_score, home_team_id, visitor_team_id, status, id } = game.game;
  const homeTeam = game.game.home_team.full_name;
  const visitorTeam = game.game.visitor_team.full_name;
  
  return (
    <Card component={Link} 
        to={{
        pathname: '/game',
        search: `?id=${encodeURIComponent(id)}`
        }} 
        state={{ home: game.home, visitor: game.visitor, game: game.game }} 
        variant="outlined" 
        sx={{ display: 'flex', flexDirection: 'row', backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(5px)', borderRadius: 8, ...props.sx}}>
      <CardMedia
        component="img"
        sx={{ width: 100, height: '70%', objectFit: 'contain', alignSelf: 'center' }}
        image={teams[home_team_id].logo}
        alt={`${homeTeam} logo`}
      />
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
        <Typography component="h5" variant="h5">
          {home_team_score} - {visitor_team_score}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {status}
        </Typography>
      </CardContent>
      <CardMedia
        component="img"
        sx={{ width: 100, height: '70%', objectFit: 'contain', alignSelf: 'center' }}
        image={teams[visitor_team_id].logo}
        alt={`${visitorTeam} logo`}
      />
    
    </Card>
  );
}

function GameCards() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [trendingGames, setTrendingGames] = useState([]);

  useEffect(() => {
    async function fetchData(date) {
      try {
        const data = await fetchTrendingGames(date);
        if (data.length > 0) {
            setTrendingGames(data);
        } else {
          const newDate = new Date(date);
          newDate.setDate(date.getDate() - 1);
          fetchData(newDate);
        }
      } catch (error) {
        console.error(error);
      }
    }
    const date = new Date();
    fetchData(date);
  }, []);
  

  if (trendingGames.length === 0) {
    return <div>Loading recent games... </div>;
  }

  return (
    <>
    <Typography component="h4" variant="h4" sx={{ paddingTop: '100px' }}>
        Today's Games
   </Typography>
    <div style={{ maxHeight: '100%', display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center'}}>
      {trendingGames.map((game, index) => (
        <GameCard key={index} game={game} sx={{ maxHeight: isSmallScreen ? 110 : 300, flexBasis: isSmallScreen ? '100%' : trendingGames.length < 3 ? '48%' : '25%'}}/>
      ))}
    </div>
    </>
  );
}

export default GameCards;