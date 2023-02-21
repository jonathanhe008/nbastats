import { Container, Typography } from '@mui/material';
import logo from '../assets/logo-gray.png';

const Footer = () => {
  return (
    <footer>
      <Container>
        <br></br>
        <Typography align="center" variant="body2" gutterBottom>
          <a href="https://jonathanhe008.github.io"><img src={logo} alt="Logo" id="logo"></img></a>
        </Typography>
        <Typography align="center" variant="body2">
          Brought to life by Jonathan He and Kevin Song, Visionaries
        </Typography>
        <br></br>
      </Container>
    </footer>
  );
};

export default Footer;