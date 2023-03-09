import './App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import TeamPage from './pages/TeamPage';
import PlayerPage from './pages/PlayerPage';  
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/player" element={<PlayerPage />} />
        <Route path="/game" element={<GamePage />} /> 
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
