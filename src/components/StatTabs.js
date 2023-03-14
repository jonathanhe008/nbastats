import { useState } from 'react';
import { Tabs, Tab, Box, createTheme, ThemeProvider, useMediaQuery } from '@mui/material';
import teams from '../assets/teams.json';

function StatTabs({ options, onChange, selectedOption }) {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (_, newValue) => {
    setSelectedTab(newValue);
    onChange(options[newValue]);
  };
  
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  let themeOptions = selectedOption ? {
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
      },
      typography: {
        fontFamily: 'Quicksand'
      },
    } : {
        typography: {
          fontFamily: 'Quicksand'
        }
      };

  const theme = createTheme(themeOptions);
  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center'  }}>
    <ThemeProvider theme={theme}>
        <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        variant={isSmallScreen ? 'scrollable' : 'fullWidth'}
        scrollButtons="auto"
        indicatorColor="secondary"
        textColor="secondary"
        allowScrollButtonsMobile
        sx={{ width: '100%' }}>
        {options.map((option, index) => (
          <Tab key={index} label={option} />
        ))}
      </Tabs>
      </ThemeProvider>
    </Box>
  );
}

export default StatTabs;