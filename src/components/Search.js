import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import players from '../assets/players.json';
import teams from '../assets/teams.json';
import { fetchPlayer } from '../api/api';

const player_content = players['league']['standard'].map(function(player) {
    return {
      title: `${player.firstName} ${player.lastName}`,
      id: player.personId,
      apiId: player.apiId,
      category: 'Player'
    }
});

const team_content = Object.entries(teams).map(([key, value]) => ({ 
    title: value.name,
    apiId: key,
    id: value.id,
    category: 'Team'
}));

function SearchComponent({ onSelect }) {
    const [selectedOption, setSelectedOption] = useState(null);

    const handleSelect = async (event, value) => {
        try {
            if (value.category === 'Player') {
                const player = await fetchPlayer(value.apiId);
                setSelectedOption(value);
                onSelect({
                    ...value,
                    info: player,
                });
            } else {
                const player_team_dict = {};
                players['league']['standard'].forEach(player => {
                    player_team_dict[player.teamId] = [ ...(player_team_dict[player.teamId] || []), player];
                });
                console.log("Player_team_dict => ", player_team_dict[value.id]);
                setSelectedOption(value);
                onSelect({
                    ...value,
                    info: player_team_dict[value.id],
                });
            }
          
        } catch (error) {
          console.error(error);
        }
      };
      
    
    
    return (
        <Autocomplete
        value={selectedOption}
        disableClearable
        onChange={handleSelect}
        options={[...player_content, ...team_content]}
        groupBy={(option) => option.category}
        getOptionLabel={(option) => option.title}
        sx={{ width: 250 }}
        size={"small"} 
        fullWidth
        renderOption={(props, option) => (
            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
              <img
                loading="lazy"
                width="20"
                src={option.category === "Player" ? `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${option.id}.png` : teams[option.apiId].logo}
                alt=""
              />
              {option.title}
            </Box>
          )}
        renderInput={(params) => <TextField {...params} label="Search a player or team" />}
        />
    );
    
}

export default SearchComponent;