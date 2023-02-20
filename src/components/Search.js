import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import players from '../assets/players.json';
import teams from '../assets/teams.json';
import teamPlayers from '../assets/team_players.json';
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
                let player_list = [];
                const team_players = teamPlayers[teams[value.apiId].abbrev];
                console.log("Official team list: ", team_players);
                players['league']['standard'].forEach(player => {
                    if (team_players.includes(`${player['firstName']} ${player['lastName']}`))
                    player_list.push(player);
                });
                console.log("Team list found: ", player_list);
                setSelectedOption(value);
                onSelect({
                    ...value,
                    info: player_list,
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
                width="50"
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