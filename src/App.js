import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TeamPage from './pages/TeamPage';
import PlayerPage from './pages/PlayerPage';  
import HomePage from './pages/HomePage';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/nbastats" element={<HomePage />} />
        <Route path="/nbastats/team" element={<TeamPage />} />
        <Route path="/nbastats/player" element={<PlayerPage />} />
      </Routes>
    </Router>
  );
}

export default App;
