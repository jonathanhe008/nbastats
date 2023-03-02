import {
  Box,
  Container,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Typography,
  Stack
} from '@mui/material';
import SearchComponent from '../components/Search';
import Footer from '../components/Footer'
import Header from '../components/Header'
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

function HomePage() {
  const navigate = useNavigate();
  const handleSelect = (value) => {
    navigate(`/nbastats/${value.category.toLowerCase()}?name=${value.title}`, { state: { selectedOption: value } });
  };

  const theme = createTheme({
    typography: {
      fontFamily: 'Quicksand',
    },
    
  });
  return (
    <div>
    <Helmet>
        <style>{`body { background-color: rgba(253, 185, 39, 0.3); }`}</style>
    </Helmet>
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Stack direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={12}
                sx={{marginTop: '2rem'}}>
            <Header sx={{ marginBottom: '2rem' }} />
            <Box display="flex" alignItems="center" textAlign="center">
                <Typography variant="subtitle1" fontFamily='Quicksand'>
                    Is your favorite player the GOAT?
                </Typography>
            </Box>
            <Container maxWidth="md">
            <SearchComponent onSelect={handleSelect} width={'100%'} />
            </Container>
        </Stack>
        <Box sx={{ flexShrink: 0, marginTop: 'auto', marginBottom: '1rem' }}>
            <Footer />
        </Box>
        </Box>
    </ThemeProvider>
    </div>
  
  );
}

export default HomePage;
