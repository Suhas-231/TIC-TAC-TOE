import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

const initialBoard = Array(9).fill(null);

const getRandomMove = (board) => {
  const available = board.map((val, i) => (val === null ? i : null)).filter(v => v !== null);
  return available[Math.floor(Math.random() * available.length)];
};

const checkWinner = (board) => {
  const combos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let combo of combos) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[b] === board[c])
      return { winner: board[a], combo };
  }
  if (board.every(cell => cell !== null)) return { winner: 'Draw' };
  return null;
};

const minimax = (board, isMax, ai, human) => {
  const result = checkWinner(board);
  if (result?.winner === ai) return { score: 1 };
  if (result?.winner === human) return { score: -1 };
  if (result?.winner === 'Draw') return { score: 0 };

  let moves = [];
  board.forEach((cell, idx) => {
    if (!cell) {
      const newBoard = [...board];
      newBoard[idx] = isMax ? ai : human;
      const { score } = minimax(newBoard, !isMax, ai, human);
      moves.push({ index: idx, score });
    }
  });

  return isMax
    ? moves.reduce((best, move) => (move.score > best.score ? move : best))
    : moves.reduce((best, move) => (move.score < best.score ? move : best));
};

const GameBoard = ({ mode, playerNames, goBack }) => {
  const [board, setBoard] = useState(initialBoard);
  const [turn, setTurn] = useState('X');
  const [winnerInfo, setWinnerInfo] = useState(null);
  const [scores, setScores] = useState(
    JSON.parse(localStorage.getItem('ttt-scores')) || { X: 0, O: 0 }
  );
  const [aiLevel, setAiLevel] = useState('easy');

  const currentPlayer = turn === 'X' ? playerNames.player1 : playerNames.player2;

  useEffect(() => {
    const result = checkWinner(board);
    if (result) {
      setWinnerInfo(result);
      if (result.winner !== 'Draw') {
        const updated = { ...scores, [result.winner]: scores[result.winner] + 1 };
        setScores(updated);
        localStorage.setItem('ttt-scores', JSON.stringify(updated));
      }
    } else if (mode === 'ai' && turn === 'O') {
      setTimeout(() => {
        let move;
        if (aiLevel === 'easy') {
          move = getRandomMove(board);
        } else if (aiLevel === 'medium') {
          // Block winning moves
          move = getMediumMove(board);
        } else {
          move = minimax(board, true, 'O', 'X').index;
        }
        makeMove(move);
      }, 500);
    }
  }, [board, turn]);

  const getMediumMove = (board) => {
    // Block or win
    const possible = board.map((val, i) => (val === null ? i : null)).filter(v => v !== null);
    for (let move of possible) {
      const temp = [...board];
      temp[move] = 'O';
      if (checkWinner(temp)?.winner === 'O') return move;

      temp[move] = 'X';
      if (checkWinner(temp)?.winner === 'X') return move;
    }
    return getRandomMove(board);
  };

  const makeMove = (idx) => {
    if (board[idx] || winnerInfo) return;
    const newBoard = [...board];
    newBoard[idx] = turn;
    setBoard(newBoard);
    setTurn(prev => (prev === 'X' ? 'O' : 'X'));
  };

  const reset = () => {
    setBoard(initialBoard);
    setWinnerInfo(null);
    setTurn('X');
  };

  const clearScores = () => {
    localStorage.removeItem('ttt-scores');
    setScores({ X: 0, O: 0 });
  };

  return (
    <div className="game-container">
      {winnerInfo?.winner !== 'Draw' && winnerInfo?.winner && <Confetti />}
      <h2>{currentPlayer}'s Turn ({turn})</h2>
      
      <div className="scoreboard">
        <span className={turn === 'X' ? 'active' : ''}>
          {playerNames.player1} (X): {scores.X}
        </span>
        <span className={turn === 'O' ? 'active' : ''}>
          {playerNames.player2} (O): {scores.O}
        </span>
      </div>

      {mode === 'ai' && (
        <div className="difficulty-selector">
          <label>Difficulty: </label>
          <select value={aiLevel} onChange={(e) => setAiLevel(e.target.value)}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      )}

      <div className="board">
        {board.map((cell, i) => (
          <div
            key={i}
            className={`cell ${winnerInfo?.combo?.includes(i) ? 'winner' : ''}`}
            onClick={() => mode === 'ai' && turn === 'O' ? null : makeMove(i)}
          >
            {cell}
          </div>
        ))}
      </div>

      <div className="controls">
        <button className="reset" onClick={reset}>🔄 Reset</button>
        <button onClick={clearScores}>🧹 Clear Scores</button>
        <button onClick={goBack}>⬅ Back</button>
      </div>

      {winnerInfo && (
        <div className="winner-msg">
          {winnerInfo.winner === 'Draw' ? "It's a draw!" : `${currentPlayer} Wins! 🎉`}
        </div>
      )}
    </div>
  );
};

export default GameBoard;
