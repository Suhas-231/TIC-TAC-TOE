import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import GameBoard from './components/GameBoard';
import './App.css';



const App = () => {
  const [mode, setMode] = useState(null);
  const [playerNames, setPlayerNames] = useState({ player1: '', player2: '' });

  return (
    <div className="app">
      {!mode ? (
        <LandingPage setMode={setMode} setPlayerNames={setPlayerNames} />
      ) : (
        <GameBoard mode={mode} playerNames={playerNames} goBack={() => setMode(null)} />
      )}
    </div>
  );
};

export default App;
