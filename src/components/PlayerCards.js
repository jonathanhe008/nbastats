import React, { useState, useEffect }  from 'react';
import { Card, CardContent, CardMedia, Typography, CardActionArea, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { fetchTrendingPlayers } from '../api/api';
import { Link } from 'react-router-dom';

function PlayerCard(props) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { player } = props;
  const { first_name, last_name } = player.player;
  const full_name = `${first_name} ${last_name}`
  const { headshotId, pts, reb, ast, blk, stl, selectedOptionObj } = player;
  
  return (
    <Card variant="outlined" sx={{ maxHeight: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(5px)', borderRadius: 8, ...props.sx  }}>
      <Link
          to={{
            pathname: '/player',
            search: `?name=${encodeURIComponent(full_name)}`
          }}
          style={{ textDecoration: 'none' }}
          state={{ selectedOption: selectedOptionObj }}
        >
      <CardActionArea>
      <CardMedia component="img" image={`https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${headshotId}.png`} alt="" sx={{ objectFit: 'cover' }} />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div" sx={{ fontSize: isSmallScreen ? '1rem' : '1.5rem' }}>
          {full_name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: isSmallScreen ? '0.6rem' : '0.875rem' }}>
          Points: {pts}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: isSmallScreen ? '0.6rem' : '0.875rem' }}>
          Assists: {ast}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: isSmallScreen ? '0.6rem' : '0.875rem' }}>
          Rebounds: {reb}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: isSmallScreen ? '0.6rem' : '0.875rem' }}>
          Blocks: {blk}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: isSmallScreen ? '0.6rem' : '0.875rem' }}>
          Steals: {stl}
        </Typography>  
      </CardContent>
    </CardActionArea>
    </Link>
  </Card>

  );
}

function PlayerCards() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [trendingData, setTrendingData] = useState([]);

  useEffect(() => {
    async function fetchData(date) {
      try {
        const data = await fetchTrendingPlayers(date);
        if (data.length > 0) {
          setTrendingData(data);
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
  

  if (trendingData.length === 0) {
    return <div>Loading recent trending players... </div>;
  }

  console.log(trendingData)
  return (
    <>
    <Typography component="h4" variant="h4" sx={{ paddingTop: '20px' }}>
        Top Dawgs 
   </Typography>
   {/* <img alt="DAWG" src={dog} height="100px" style={{ marginTop: '30px' }}/>  */}
    <div style={{ maxWidth: '100%', display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center'}}>
      {trendingData.map((player, index) => (
        <PlayerCard key={index} player={player} sx={{ maxWidth: isSmallScreen ? 110 : 250 }}/>
      ))}
    </div>
    </>
  );
}

export default PlayerCards;
