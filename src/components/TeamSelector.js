import React from 'react';
import { Select, MenuItem, Box, Typography } from '@mui/material';
import teams from '../assets/teams.json';
import nba_logo from '../assets/nba.png';

const team_content = Object.entries(teams).map(([key, value]) => ({ 
    title: value.name,
    apiId: key,
    id: value.id,
    category: 'Team',
    logo: value.logo
}));

function TeamSelector(props) {
    const { selectedTeam, onTeamSelected, isLoading } = props;
  
    const handleTeamChange = (event) => {
      const team = event.target.value;
      onTeamSelected(team);
    };
    
    return (
    <Select value={selectedTeam} onChange={handleTeamChange} displayEmpty disabled={isLoading} style={{ width: 275, height: 60 }}>
    <MenuItem value="">
        <Box display="flex" alignItems="center">
            <img src={nba_logo} alt="NBA" style={{ width: 30, marginRight: 8, flexShrink: 0 }} />
            <Typography variant="inherit">All NBA Teams</Typography>
        </Box>
    </MenuItem>
    {team_content.map((team) => (
        <MenuItem key={team.title} value={team.apiId}>
        <Box display="flex" alignItems="center">
            <img src={team.logo} alt={team.title} style={{ width: 30, marginRight: 8, flexShrink: 0 }} />
            <Typography variant="inherit">{team.title}</Typography>
        </Box>
        </MenuItem>
    ))}
    </Select>

    );
}

export default TeamSelector;