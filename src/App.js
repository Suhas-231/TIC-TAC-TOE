import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import GameBoard from './components/GameBoard';
import './App.css';

const App = () => {
  const [gameData, setGameData] = useState(null);

  const handleStartGame = (data) => {
    const [player1, player2] = data.players;
    setGameData({
      mode: data.mode,
      players: { player1, player2 },
    });
  };

  return (
    <div className="app">
      {!gameData ? (
        <LandingPage onStart={handleStartGame} />
      ) : (
        <GameBoard
          mode={gameData.mode}
          playerNames={gameData.players}
          goBack={() => setGameData(null)}
        />
      )}
    </div>
  );
};

export default App;
