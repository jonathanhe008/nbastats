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
import goats from '../assets/goats.png'
function HomePage() {
  const navigate = useNavigate();
  const handleSelect = (value) => {
    navigate(`/${value.category.toLowerCase()}?name=${value.title}`, { state: { selectedOption: value } });
  };

  const theme = createTheme({
    typography: {
      fontFamily: 'Quicksand',
    },
    
  });
  return (
    <>
    <Helmet>
        <style>{`body { background-color: rgba(253, 185, 39, 0.3); }`}</style>
    </Helmet>
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Stack direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={2}
                sx={{marginTop: '2rem'}}>
            <Header team='LAL' sx={{ marginBottom: '2rem' }} />
            <Box display="flex" alignItems="center" textAlign="center">
                <Typography variant="h6" fontFamily='Quicksand'>
                    Is your favorite player the GOAT?
                </Typography>
            </Box>
            <img
                src={goats}
                alt=""
                style={{ width: "auto", height: "30vh", objectFit: "contain" }}
            />
            <Container maxWidth="md">
            <SearchComponent onSelect={handleSelect} width={'100%'} />
            </Container>
        </Stack>
        <Box sx={{ flexShrink: 0, marginTop: 'auto', marginBottom: '1rem', position: 'fixed', bottom: 0, width: '100%' }}>
            <Footer />
        </Box>
        </Box>
    </ThemeProvider>
    </>
  
  );
}

export default HomePage;
