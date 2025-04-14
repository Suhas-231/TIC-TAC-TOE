// src/components/LandingPage.js
import React, { useState } from "react";
import "./LandingPage.css";

const LandingPage = ({ onStart }) => {
  const [mode, setMode] = useState("pvp");
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");

  const handleStart = () => {
    if (mode === "pvp" && (!player1 || !player2)) return alert("Enter both player names");
    if (mode === "ai" && !player1) return alert("Enter your name");

    onStart({
      mode,
      players: mode === "pvp" ? [player1, player2] : [player1, "Computer"],
    });
  };

  return (
    <div className="landing-container">
      <h1>Tic Tac Toe</h1>

      <div className="mode-toggle">
        <button
          className={mode === "pvp" ? "active" : ""}
          onClick={() => setMode("pvp")}
        >
          Player vs Player
        </button>
        <button
          className={mode === "ai" ? "active" : ""}
          onClick={() => setMode("ai")}
        >
          Player vs Computer
        </button>
      </div>

      <div className="input-group">
        <input
          type="text"
          placeholder="Player 1 Name"
          value={player1}
          onChange={(e) => setPlayer1(e.target.value)}
        />
        {mode === "pvp" && (
          <input
            type="text"
            placeholder="Player 2 Name"
            value={player2}
            onChange={(e) => setPlayer2(e.target.value)}
          />
        )}
      </div>

      <button className="start-btn" onClick={handleStart}>
        🎮 Start Game
      </button>
    </div>
  );
};

export default LandingPage;
