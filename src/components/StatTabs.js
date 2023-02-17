import { useState } from 'react';
import { Tabs, Tab, Box, createTheme, ThemeProvider } from '@mui/material';
import teams from '../assets/teams.json';

function StatTabs({ options, onChange, selectedOption }) {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (_, newValue) => {
    setSelectedTab(newValue);
    onChange(options[newValue]);
  };
  
  const theme = createTheme({
    components: {
        MuiTabs: {
          styleOverrides: {
            root: {
              '& .MuiTabs-indicator': {
                backgroundColor: selectedOption.category === 'Player' ? `rgb(${teams[selectedOption.info.team.id].primary_color})` 
                : `rgb(${teams[selectedOption.apiId].primary_color})`,
              },
            },
          },
        },
        MuiTab: {
          styleOverrides: {
            root: {
              '&.Mui-selected': {
                color: selectedOption.category === 'Player' ? `rgb(${teams[selectedOption.info.team.id].primary_color})` 
                : `rgb(${teams[selectedOption.apiId].primary_color})`,
              },
              '&:hover': {
                color: selectedOption.category === 'Player' ? `rgb(${teams[selectedOption.info.team.id].primary_color})` 
                : `rgb(${teams[selectedOption.apiId].primary_color})`,
              },
            },
          }
        },
      }
    });
  return (
    <Box sx={{ width: '100%' }}>
    <ThemeProvider theme={theme}>
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        variant="fullWidth"
        indicatorColor="secondary"
        textColor="secondary">
        {options.map((option, index) => (
          <Tab key={index} label={option} />
        ))}
      </Tabs>
      </ThemeProvider>
    </Box>
  );
}

export default StatTabs;
//{`rgb(${teams[selectedOption.info.team.id].primary_color})`}